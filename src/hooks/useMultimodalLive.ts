import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage } from '@google/genai';
import { AgentConfig, LeadInfo, OfferInfo } from '../types';
import { createPcmBlob, base64ToBytes, decodeAudioData } from '../utils/audioUtils';
import { captureLeadTool, structureOfferTool, estimateArvTool, sendOfferEmailTool, searchCompsTool } from '../utils/toolDefinitions';

// Constants
// Switched to public experimental model for stability
const MODEL_NAME = 'gemini-2.0-flash-exp';
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const MAX_RETRIES = 3;

export const useMultimodalLive = (config: AgentConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0); // 0 to 1
  const [transcript, setTranscript] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [leads, setLeads] = useState<LeadInfo[]>([]);
  const [offers, setOffers] = useState<OfferInfo[]>([]);

  // Refs for audio handling to avoid re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const currentTurnTranscriptRef = useRef<{ user: string; model: string }>({ user: '', model: '' });
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load leads and offers from local storage on mount
  useEffect(() => {
    try {
      const savedLeads = localStorage.getItem('rei_leads');
      if (savedLeads) setLeads(JSON.parse(savedLeads));

      const savedOffers = localStorage.getItem('rei_offers');
      if (savedOffers) setOffers(JSON.parse(savedOffers));
    } catch (e) {
      console.error("Failed to parse local storage data");
    }
  }, []);

  // Helper to save lead with intelligent merging
  const saveLead = useCallback((leadData: Partial<LeadInfo>) => {
    setLeads((prev) => {
      // Logic: If the last lead was created recently (or exists), assume we are adding details to it.
      // This solves the issue of Name/Email splitting into separate entries.
      const lastLead = prev[prev.length - 1];
      let updatedLeads = [...prev];

      if (lastLead) {
          // Merge new data into the existing last lead
          // Only overwrite fields if the new data is truthy to avoid blanking out existing data
          updatedLeads[prev.length - 1] = { 
            ...lastLead, 
            ...leadData,
            // Ensure we don't accidentally overwrite with undefined
            name: leadData.name || lastLead.name,
            email: leadData.email || lastLead.email,
            phone: leadData.phone || lastLead.phone,
            propertyAddress: leadData.propertyAddress || lastLead.propertyAddress,
            motivation: leadData.motivation || lastLead.motivation
          };
      } else {
          // Create new if list is empty
          const newLead: LeadInfo = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...leadData
          };
          updatedLeads.push(newLead);
      }

      localStorage.setItem('rei_leads', JSON.stringify(updatedLeads));
      return updatedLeads;
    });
  }, []);

  // Helper to save offer
  const saveOffer = useCallback((offerData: Partial<OfferInfo>) => {
    setOffers((prev) => {
      const newOffer: OfferInfo = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        offerType: 'OTHER', 
        purchasePrice: 0, 
        ...offerData
      } as OfferInfo;

      const updatedOffers = [...prev, newOffer];
      localStorage.setItem('rei_offers', JSON.stringify(updatedOffers));
      return updatedOffers;
    });
  }, []);

  // Clean up all audio and session resources
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    sessionPromiseRef.current = null;
  }, []);

  // Disconnect function
  const disconnect = useCallback(() => {
    cleanup();
    setIsConnected(false);
    setIsConnecting(false);
  }, [cleanup]);

  const connect = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      setError('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env.local');
      return;
    }

    const connectWithRetry = async (attempt: number) => {
      // Clean up previous attempts
      cleanup();
      
      try {
        console.log('[Connect] Starting connection attempt', attempt + 1);
        setIsConnecting(true);
        setError(null);

        // 1. Setup Audio Contexts
        console.log('[Connect] Setting up audio contexts...');
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass({ sampleRate: OUTPUT_SAMPLE_RATE });
        inputContextRef.current = new AudioContextClass({ sampleRate: INPUT_SAMPLE_RATE });

        await audioContextRef.current.resume();
        await inputContextRef.current.resume();
        console.log('[Connect] Audio contexts ready');

        // 2. Get Microphone Stream
        console.log('[Connect] Requesting microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        console.log('[Connect] Microphone access granted');

        // 3. Initialize Gemini Client
        console.log('[Connect] Initializing Gemini client...');
        const ai = new GoogleGenAI({ apiKey });
        
        // Define tool declarations safely
        const tools = [{ functionDeclarations: [captureLeadTool, structureOfferTool, estimateArvTool, sendOfferEmailTool, searchCompsTool] as any }];
        console.debug("[LiveConfig] tools:", tools);

        // 4. Connect to Live API
        console.log('[Connect] Connecting to Gemini Live API...');
        const sessionPromise = ai.live.connect({
          model: MODEL_NAME,
          config: {
            // STRICT STABILITY FIX: Use string literal array. Do NOT use Modality enum here.
            responseModalities: ['AUDIO'] as any, 
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voiceName } },
            },
            systemInstruction: { parts: [{ text: config.systemInstruction }] },
            tools: tools,
          },
          callbacks: {
            onopen: () => {
              console.log('[Connect] ✅ Gemini Live Session Opened Successfully!');
              setIsConnected(true);
              setIsConnecting(false);
              
              if (audioContextRef.current?.state === 'suspended') {
                  audioContextRef.current.resume();
              }

              // Setup Audio Pipeline
              if (!inputContextRef.current || !streamRef.current) return;
              
              const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
              const gainNode = inputContextRef.current.createGain();
              gainNode.gain.value = 1.5; 
              
              const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
              
              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Calculate volume
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                  sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(Math.min(rms * 5, 1)); 

                // Send to Gemini
                const pcmBlob = createPcmBlob(inputData);
                sessionPromiseRef.current?.then((session: any) => {
                  try {
                     session.sendRealtimeInput({ media: pcmBlob });
                  } catch (e) {
                    // Ignored
                  }
                });
              };

              source.connect(gainNode);
              gainNode.connect(processor);
              processor.connect(inputContextRef.current.destination);
              
              sourceRef.current = source;
              gainNodeRef.current = gainNode;
              processorRef.current = processor;
            },
            onmessage: async (message: LiveServerMessage) => {
              const content = message.serverContent;
              
              if (content?.modelTurn?.parts?.[0]?.inlineData) {
                 const base64Audio = content.modelTurn.parts[0].inlineData.data;
                 if (audioContextRef.current && base64Audio) {
                   const ctx = audioContextRef.current;
                   nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                   
                   const audioBuffer = await decodeAudioData(
                     base64ToBytes(base64Audio),
                     ctx,
                     OUTPUT_SAMPLE_RATE
                   );
                   
                   const source = ctx.createBufferSource();
                   source.buffer = audioBuffer;
                   source.connect(ctx.destination);
                   source.start(nextStartTimeRef.current);
                   nextStartTimeRef.current += audioBuffer.duration;
                 }
              }

              if (content?.turnComplete) {
                 setTranscript(prev => [
                   ...prev, 
                   { role: 'user', text: currentTurnTranscriptRef.current.user },
                   { role: 'model', text: currentTurnTranscriptRef.current.model }
                 ]);
                 currentTurnTranscriptRef.current = { user: '', model: '' };
              }

              if (message.toolCall) {
                console.log("Tool Call Received:", message.toolCall);
                const functionCalls = message.toolCall.functionCalls;
                const functionResponses = [];

                for (const call of functionCalls) {
                  let toolResult: any = { result: "Success" };

                  if (call.name === 'captureLeadInfo') {
                     saveLead(call.args as any);
                     toolResult = { result: "Lead info captured/updated. (System Note: If Name/Email missing, ask for them. If complete, move to Motivation.)" };
                  } else if (call.name === 'structureOffer') {
                     saveOffer(call.args as any);
                     toolResult = { result: `Offer structured successfully. Present the terms.` };
                  } else if (call.name === 'estimateArv') {
                     const args = call.args as any;
                     const hasDetails = args.beds || args.baths || args.squareFeet || args.condition;
                     
                     if (hasDetails) {
                        toolResult = { result: `Property Details Captured: ${args.beds}bd/${args.baths}ba, ${args.squareFeet}sqft, Condition: ${args.condition}. ACTION: Based on this data and the location, provide a conservative ARV estimate now.` };
                     } else {
                        toolResult = { result: `System Instruction: To estimate ARV accurately, you MUST ask for: Beds, Baths, Square Footage, and Condition (1-10). Capture these details then re-evaluate.` };
                     }
                  } else if (call.name === 'searchComps') {
                     const args = call.args as any;
                     toolResult = { 
                        result: `SYSTEM: Search executed for ${args.address || 'location'} (0.5 mi radius). 
                        ACTION: Access your internal real estate database. List 3 comparable properties sold recently near this address. 
                        For each, provide: Address, Sold Price, Date, Beds/Baths, and Sqft. 
                        Then calculate the average price per sqft to refine the ARV.` 
                     };
                  } else if (call.name === 'sendOfferEmail') {
                     toolResult = { result: `Email sent successfully to ${call.args['toEmail']}. Tell user to check inbox.` };
                  }

                  functionResponses.push({
                    id: call.id,
                    name: call.name,
                    response: toolResult
                  });
                }

                if (functionResponses.length > 0) {
                   sessionPromiseRef.current?.then((session: any) => {
                     session.sendToolResponse({ functionResponses });
                   });
                }
              }

              if (content?.interrupted) {
                 nextStartTimeRef.current = 0;
              }
            },
            onclose: () => {
              console.log('[Connect] ⚠️ Session Closed');
              setIsConnected(false);
              setIsConnecting(false);
            },
            onerror: (err: any) => {
              console.error('[Connect] ❌ Session Error:', err);
              console.error('[Connect] Error details:', { message: err.message, code: err.code, status: err.status });
              
              const msg = err.message || String(err);
              const code = err.code || err.status || err.statusCode;
              const isRetryable = code === 503 || code === 'UNAVAILABLE' || msg.includes('Network Error') || msg.includes('network');

              // Retry Logic
              if (isRetryable && attempt < MAX_RETRIES) {
                 const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
                 console.log(`Retryable error (${code}). Retrying in ${delay}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
                 setError(`Connection lost. Retrying... (${attempt + 1})`);
                 
                 retryTimeoutRef.current = setTimeout(() => {
                    connectWithRetry(attempt + 1);
                 }, delay);
              } else {
                 const finalError = code ? `Error ${code}: ${msg}` : msg;
                 setError(finalError);
                 setIsConnected(false);
                 setIsConnecting(false);
                 cleanup();
              }
            },
          },
        });
        
        sessionPromiseRef.current = sessionPromise;

      } catch (err: any) {
        console.error('[Connect] ❌ Connection Setup Error:', err);
        console.error('[Connect] Error details:', { message: err.message, name: err.name, stack: err.stack });
        const msg = err.message || "Failed to connect";
        
        if (attempt < MAX_RETRIES) {
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`Setup error. Retrying in ${delay}ms...`);
            setError(`Connection failed. Retrying... (${attempt + 1})`);
            retryTimeoutRef.current = setTimeout(() => {
                connectWithRetry(attempt + 1);
            }, delay);
        } else {
            setError(msg);
            setIsConnecting(false);
            cleanup();
        }
      }
    };

    // Start first attempt
    connectWithRetry(0);

  }, [config, saveLead, saveOffer, cleanup]);

  return {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    error,
    volume,
    transcript,
    leads,
    offers
  };
};
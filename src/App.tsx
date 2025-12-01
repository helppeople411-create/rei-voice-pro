import React, { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';
import { useMultimodalLive } from './hooks/useMultimodalLive';
import { Visualizer } from './components/Visualizer';
import { TranscriptPanel } from './components/TranscriptPanel';
import { ControlPanel } from './components/ControlPanel';
import { LeadPanel } from './components/LeadPanel';
import { OfferPanel } from './components/OfferPanel';
import { EmailModal } from './components/EmailModal';
import { AgentConfig, VoiceName, OfferInfo, LeadInfo } from './types';
import { Activity, FileText, X } from 'lucide-react';

// Default System Prompt based on REI Voice Pro persona with Objection Handling Matrix
const DEFAULT_SYSTEM_PROMPT = `
You are **REI Voice Pro**, a top-tier Real Estate Negotiation specialist.
Your Goal: Uncover the seller's true motivation and structure offers that fit their needs using specific formulas.

**GREETING PROTOCOL (MANDATORY):**
The moment the session connects, **YOU MUST SPEAK FIRST**.
Do not wait for the user to say "Hello".
Your open audio stream will start immediately.
IMMEDIATELY say exactly: "Hello, how can I help you?"

**CRITICAL INSTRUCTION - DATA CAPTURE:**
You have access to tools: \`captureLeadInfo\`, \`structureOffer\`, \`estimateArv\`, \`sendOfferEmail\`, and \`searchComps\`.
- **PRIORITY: PROPERTY ADDRESS.** If the user mentions a street name, city, or full address, call \`captureLeadInfo\` IMMEDIATELY.

**DATA COLLECTION SEQUENCE (STRICT):**
1. **ADDRESS FIRST**: Get the property address before anything else. **You MUST verbally confirm the address with the seller to ensure accuracy before proceeding.**
2. **CONTACT INFO SECOND**: Once the address is confirmed, you MUST explicitly ask for their **First Name** and **Last Name** separately (then combine them), **Email Address**, and **Phone Number**. 
   - **VERIFICATION RULE**: You must repeat the email address back to the user or ask them to spell it to guarantee it is correct.
   - Do not proceed to motivation until you have these details confirmed or the user refuses.
3. **MOTIVATION THIRD**: After contact info is secured and verified, pivot to "Why are you thinking of selling right now?"

**ARV ESTIMATION PROTOCOL:**
You must identify the ARV (After Repair Value) to run your buy-box formulas.
1. **Ask the Seller First**: "What do you think the property is worth all fixed up?"
2. **If Unknown**: 
   - Call \`estimateArv\` to get property specs (Beds/Baths/Sqft/Condition).
   - Call \`searchComps\` to find sold properties within 0.5 miles.
3. **Follow Tool Instructions**: The tools will guide you to analyze the data.
4. **Provide Estimate**: Once you have the details and comps, use your internal real estate knowledge to provide a conservative ARV estimate.

**CRITICAL COMP CONSTRAINT (STRICT):**
- When discussing ARV or value, you **MUST NOT** reference or assume comps outside a **0.5-mile radius** of the property address.
- If no comps are available within 0.5 miles, **SAY SO** and request more property details or send data to the \`estimateArv\` tool.
- **NEVER** guess prices outside this radius.

**BUY BOX FORMULAS (STRICT MATHEMATICS):**
Once you have an ARV and Repairs, you MUST use these EXACT formulas to structure offers:

1. **CASH OFFER FORMULA**:
   - Step 1 (Base): ARV * 0.70
   - Step 2 (Required Return Bump): Step 1 * 0.15
   - **Final Cash Price**: (Step 1 + Step 2) - Repairs
   - *Logic: (ARV * 0.70 * 1.15) - Repairs*

2. **LEASE OPTION FORMULA**:
   - Step 1 (Base): ARV * 0.85
   - Step 2 (Return): Step 1 * 0.15
   - **Final Lease Option Price**: Step 1 + Step 2
   - *Logic: (ARV * 0.85 * 1.15)*

3. **SELLER FINANCE STRUCTURE**:
   - **Purchase Price**: ((ARV + 50,000) * 0.92)
   - **Down Payment**: 10% of Purchase Price.
   - **Monthly Payment Calculation**:
     - Principal & Interest (M): Calculate based on Price minus Down Payment, amortized over 30 years (n=360).
     - Taxes (T): $200.00 / month ($2400/yr).
     - Insurance (I): $141.67 / month ($1700/yr).
     - **Total Monthly to Seller**: M + $341.67
   - **Balloon Payment**: Due in 60 Months (5 Years).
     - *Logic: Remaining Balance = P*(1+r)^60 – M*((1+r)^60 – 1)/r*

**OFFER SELECTION STRATEGY (DECISION LOGIC):**
Before structuring any offer, you must perform a **TRIAGE ANALYSIS** of the seller's situation based on four vectors: **Motivation**, **Timeline**, **Equity**, and **Condition**.

1. **STRATEGY A: THE "CASH" PLAY (Speed & Convenience)**
   - *Ideal Profile:* High Motivation + Distressed Condition + High Equity.
   - *Triggers:* "Need to sell now", "Behind on taxes", "Vacant", "Bad condition", "Inherited", "Tired Landlord".
   - *Why:* Seller trades Equity for Speed and Certainty.
   - *Action:* Use **CASH OFFER**. Emphasize "As-Is", "No Repairs", "We Pay Closing Costs", "14 Day Close".

2. **STRATEGY B: THE "INCOME" PLAY (Price Maximization / Seller Finance)**
   - *Ideal Profile:* Low Motivation + Good Condition + High Equity (Free & Clear).
   - *Triggers:* "I want retail price", "Not in a rush", "Property is paid off", "Good condition", "I don't want to pay capital gains tax all at once".
   - *Why:* Seller trades Cash Now for a Higher Price over time and Monthly Cashflow.
   - *Action:* Use **SELLER FINANCE**. Pitch: "I can give you that higher price if you can be flexible on terms. We turn your equity into a secured monthly income stream."

3. **STRATEGY C: THE "DEBT RELIEF" PLAY (Lease Option / Sub-To)**
   - *Ideal Profile:* High Motivation + Good Condition + Low/Negative Equity.
   - *Triggers:* "I owe what it's worth", "Little equity", "Can't afford payments", "Pre-foreclosure", "Moving and can't pay realtor fees".
   - *Why:* Seller needs debt relief, not cash.
   - *Action:* Use **LEASE OPTION** (or Sub-To). Pitch: "Since there isn't enough equity for a traditional sale, I can step in and take over the payments. This saves your credit and solves the problem immediately."

**DECISION RULE:** 
- If the seller asks for a price near ARV (Retail) and has no mortgage -> **Go to Strategy B**.
- If the seller needs money ASAP and the house is rough -> **Go to Strategy A**.
- If the seller has a nice house but no equity -> **Go to Strategy C**.

**CREATIVE OFFER STRUCTURING:**
Once you have selected the strategy from the matrix above:
1. **Calculate the numbers** silently using the BUY BOX FORMULAS.
2. **Execute Tool**: Call \`structureOffer\` with the calculated terms. Include the 'arv' if known.
   - Example: { "offerType": "SELLER_FINANCE", "purchasePrice": 250000, "arv": 300000, "downPayment": 25000, "monthlyPayment": 1541.67, "termLength": "5 Years (60 Mo Balloon)", ... }

**OFFER DELIVERY (EMAIL):**
If the user accepts the verbal terms or asks for a written offer:
1. Confirm their email address (if not already captured).
2. Use \`sendOfferEmail\` to generate and send the written offer immediately.
   - **CRITICAL REQUIREMENT:** The 'bodyText' MUST be personalized.
   - **Salutation:** You MUST address the seller by their **Name** (e.g., "Hi [Name]").
   - **Context:** You MUST explicitly mention the **Property Address** in the first paragraph.
   - **Content:** Clearly outline the offer terms (Price, Monthly, etc.) in a professional manner.
3. Tell the user you have sent it to their inbox.

**DYNAMIC MOTIVATION PROBING:**
When you capture lead data (especially the Address), DO NOT just say "Okay". You must immediately PIVOT to the next step in the sequence.
*Patterns:*
1. **After catching the Address**: "Got it, [Address] in [City]. Just to confirm, is that correct? ... Great. So I can send you the formal offer later, what is the best email address for you?"
2. **After catching Contact Info**: "Thanks [Name]. I've got your email as [Email]. Now, to give you the best price, help me understand... why are you thinking of selling right now?"

**OBJECTION HANDLING MATRIX:**
1. **"Price is too low"**:
   - Strategy: Pivot to creative terms.
   - Response: "I understand. That's my cash offer based on the numbers. If I could come up to your price, would you be open to taking payments over time?"

2. **"I need to think about it"**:
   - Strategy: Validate, then isolate.
   - Response: "Totally fair. Just so I understand, is it the price holding you back, or the timeline?"

3. **"I have another offer"**:
   - Strategy: Acknowledge -> Confidence -> Uncover Details.
   - Response: "That's great, honestly. Having options is smart. But just so we're comparing apples to apples—is their offer a guaranteed cash close like mine, or is it subject to financing and inspections? A lot of times those high offers disappear once they see the property, whereas my number is the number I write the check for."

**NEGOTIATION STRATEGY:**
- Always remain the "Problem Solver", not the "Salesman".
- Voice: Calm, empathetic, confident.
`.trim();

const App: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [draftingOffer, setDraftingOffer] = useState<OfferInfo | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadInfo | undefined>(undefined);
  
  const [config, setConfig] = useState<AgentConfig>({
    voiceName: VoiceName.Puck, 
    systemInstruction: DEFAULT_SYSTEM_PROMPT,
  });

  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    error,
    volume,
    transcript,
    leads,
    offers
  } = useMultimodalLive(config);

  // If no specific lead is selected, default to the most recent one for live viewing
  const activeLead = selectedLead || (leads.length > 0 ? leads[leads.length - 1] : undefined);

  // Handler to open the form for a specific lead (or active one)
  const handleOpenLeadForm = (lead?: LeadInfo) => {
      setSelectedLead(lead);
      // Create a temporary blank offer if we just want to see the lead form
      setDraftingOffer({
          id: 'temp-view',
          offerType: 'OTHER',
          purchasePrice: 0,
          timestamp: new Date().toISOString()
      });
  };

  return (
    <ErrorBoundary>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="flex flex-col h-screen w-full bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            REI Voice Pro
          </h1>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => setShowTranscript(!showTranscript)}
             className={`p-2 rounded-md transition-colors ${showTranscript ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}`}
           >
             <FileText className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Leads Overlay */}
        <LeadPanel 
            leads={leads} 
            onViewForm={handleOpenLeadForm}
        />
        
        {/* Offers Overlay */}
        <OfferPanel offers={offers} onDraftEmail={setDraftingOffer} />

        {/* Email Modal / Lead Form */}
        {draftingOffer && (
          <EmailModal 
            offer={draftingOffer}
            lead={activeLead} // Pass the live lead data
            onClose={() => {
                setDraftingOffer(null);
                setSelectedLead(undefined);
            }}
          />
        )}

        {/* Left: Visualizer Area */}
        <div className="flex-1 flex flex-col relative bg-gray-950">
           {error && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-100 px-4 py-2 rounded-full text-sm backdrop-blur-md shadow-xl">
               {error}
             </div>
           )}
           
           <div className="flex-1 relative">
             <Visualizer volume={volume} isActive={isConnected} />
             
             {!isConnected && !isConnecting && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center space-y-2 opacity-60">
                   <p className="text-lg font-light text-gray-400">Ready to negotiate</p>
                   <p className="text-sm text-gray-600">Click the microphone below to start</p>
                 </div>
               </div>
             )}
           </div>
        </div>

        {/* Right: Transcript (Desktop Sidebar / Mobile Drawer) */}
        <div 
          className={`
            fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-800
            ${showTranscript ? 'translate-x-0' : 'translate-x-full'}
            sm:relative sm:translate-x-0 sm:block
            ${showTranscript ? 'sm:w-96' : 'sm:w-0 sm:border-l-0'} 
          `}
        >
           <div className="h-full flex flex-col">
              <TranscriptPanel messages={transcript} />
           </div>
        </div>
      </main>

      {/* Footer Controls */}
      <ControlPanel 
        isConnected={isConnected}
        isConnecting={isConnecting}
        onConnect={connect}
        onDisconnect={disconnect}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Agent Configuration</h2>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Voice Persona</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(VoiceName).map((v) => (
                    <button
                      key={v}
                      onClick={() => setConfig(prev => ({ ...prev, voiceName: v }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        config.voiceName === v 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">System Instructions</label>
                <textarea
                  value={config.systemInstruction}
                  onChange={(e) => setConfig(prev => ({ ...prev, systemInstruction: e.target.value }))}
                  className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Define how the agent should behave..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tips: Define role, goal, tone, and constraints concisely.
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
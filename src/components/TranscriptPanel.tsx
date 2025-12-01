import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface TranscriptPanelProps {
  messages: { role: 'user' | 'model'; text: string }[];
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 border-l border-gray-800">
      <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 sticky top-0 bg-gray-900 py-2">
        Live Transcript
      </h2>
      
      {messages.length === 0 && (
        <div className="text-gray-600 text-center italic mt-10">
          Conversation will appear here...
        </div>
      )}

      {messages.map((msg, idx) => (
        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-800 text-gray-200 rounded-bl-none'
            }`}
          >
            {msg.text}
          </div>
          <span className="text-xs text-gray-500 mt-1 px-1">
            {msg.role === 'user' ? 'You' : 'REI Agent'}
          </span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};
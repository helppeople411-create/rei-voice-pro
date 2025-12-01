import React from 'react';
import { Mic, MicOff, PhoneOff, Settings, Radio } from 'lucide-react';

interface ControlPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onOpenSettings: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  onOpenSettings,
}) => {
  return (
    <div className="h-24 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-6 md:px-12 z-10">
      
      {/* Status Indicator */}
      <div className="flex items-center space-x-3 w-1/3">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-gray-300 font-medium text-sm hidden md:block">
          {isConnected ? 'Agent Active' : isConnecting ? 'Connecting...' : 'Agent Offline'}
        </span>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-6 w-1/3">
        {!isConnected ? (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className={`group relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 shadow-lg ${
              isConnecting
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 hover:scale-105 hover:shadow-green-500/50'
            }`}
          >
            <Mic className={`w-8 h-8 text-white ${isConnecting ? 'animate-spin' : ''}`} />
            <span className="absolute -bottom-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Start Call
            </span>
          </button>
        ) : (
          <button
            onClick={onDisconnect}
            className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/50"
          >
            <PhoneOff className="w-8 h-8 text-white" />
            <span className="absolute -bottom-8 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              End Call
            </span>
          </button>
        )}
      </div>

      {/* Settings / Extra */}
      <div className="flex items-center justify-end space-x-4 w-1/3">
        <button 
          onClick={onOpenSettings}
          className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
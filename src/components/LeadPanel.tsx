import React from 'react';
import { LeadInfo } from '../types';
import { User, Phone, Mail, Home, Flag, FileText, ArrowRight } from 'lucide-react';

interface LeadPanelProps {
  leads: LeadInfo[];
  onViewForm?: (lead?: LeadInfo) => void;
}

export const LeadPanel: React.FC<LeadPanelProps> = ({ leads, onViewForm }) => {
  // Show latest lead at the top
  const sortedLeads = [...leads].reverse();

  return (
    <div className="absolute top-20 left-6 z-30 w-80 max-h-[calc(100vh-200px)] overflow-y-auto pointer-events-none">
      {/* Header / "Open Live Form" Button */}
      <div className="pointer-events-auto mb-4 flex justify-between items-center bg-gray-900/80 backdrop-blur rounded-lg p-2 border border-gray-700/50 shadow-lg">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-2">Captured Leads</span>
        {onViewForm && (
            <button 
                onClick={() => onViewForm()}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-600/20 transition-all"
            >
                <FileText className="w-3 h-3" />
                <span>View Live Form</span>
            </button>
        )}
      </div>

      <div className="space-y-4 pointer-events-auto">
        {sortedLeads.map((lead) => (
          <div key={lead.id} className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 shadow-xl transition-all hover:border-gray-600">
            <div className="flex items-center space-x-2 mb-3 border-b border-gray-700 pb-2">
              <div className="p-1 bg-green-500/20 rounded-md">
                <User className="w-4 h-4 text-green-400" />
              </div>
              <h3 className="font-semibold text-white truncate max-w-[150px]">{lead.name || 'Unknown Lead'}</h3>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              {lead.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span className="truncate">{lead.email}</span>
                </div>
              )}
              {lead.propertyAddress && (
                <div className="flex items-start space-x-2">
                  <Home className="w-3.5 h-3.5 text-gray-500 mt-1" />
                  <span className="flex-1 leading-tight">{lead.propertyAddress}</span>
                </div>
              )}
              {lead.motivation && (
                <div className="flex items-start space-x-2 mt-2 pt-2 border-t border-gray-700/50">
                  <Flag className="w-3.5 h-3.5 text-orange-400 mt-1" />
                  <span className="flex-1 leading-tight text-orange-100/80 italic">"{lead.motivation}"</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {onViewForm && (
                <div className="mt-3 pt-2 border-t border-gray-700/50 flex justify-end">
                    <button 
                        onClick={() => onViewForm(lead)}
                        className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                        <span>Open Draft</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
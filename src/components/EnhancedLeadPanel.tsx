import React, { useState, useMemo } from 'react';
import { Users, Search, X, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { LeadInfo } from '../types';

interface EnhancedLeadPanelProps {
  leads: LeadInfo[];
  onViewForm: (lead?: LeadInfo) => void;
  onExport?: () => void;
}

export const EnhancedLeadPanel: React.FC<EnhancedLeadPanelProps> = ({ leads, onViewForm, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter leads based on search query
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    
    const query = searchQuery.toLowerCase();
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query) ||
      lead.propertyAddress?.toLowerCase().includes(query) ||
      lead.motivation?.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-30 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
        title="View Leads"
      >
        <Users className="w-6 h-6" />
        {leads.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {leads.length}
          </span>
        )}
      </button>

      {/* Slide-out Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-gray-900 border-r border-gray-800 shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Leads ({leads.length})</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? 'No leads match your search' : 'No leads captured yet'}
                  </p>
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      onViewForm(lead);
                      setIsOpen(false);
                    }}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {lead.name || 'Unnamed Lead'}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lead.timestamp)}
                      </span>
                    </div>

                    {lead.propertyAddress && (
                      <div className="flex items-start gap-2 text-sm text-gray-400 mb-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{lead.propertyAddress}</span>
                      </div>
                    )}

                    {lead.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{lead.email}</span>
                      </div>
                    )}

                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}

                    {lead.motivation && (
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-500 line-clamp-2">
                          <span className="font-medium">Motivation:</span> {lead.motivation}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {leads.length > 0 && onExport && (
              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={onExport}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Export All Leads
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

import React from 'react';
import { OfferInfo } from '../types';
import { DollarSign, Calendar, Percent, FileCheck, TrendingUp, Mail } from 'lucide-react';

interface OfferPanelProps {
  offers: OfferInfo[];
  onDraftEmail?: (offer: OfferInfo) => void;
}

export const OfferPanel: React.FC<OfferPanelProps> = ({ offers, onDraftEmail }) => {
  if (offers.length === 0) return null;

  // Show latest offer at the top
  const sortedOffers = [...offers].reverse();

  return (
    <div className="absolute top-[300px] left-6 z-30 w-80 max-h-[calc(100vh-320px)] overflow-y-auto">
      <div className="space-y-4">
        {sortedOffers.map((offer) => (
          <div key={offer.id} className="bg-gray-900/90 backdrop-blur-md border border-yellow-600/50 rounded-xl p-4 shadow-xl shadow-yellow-900/10 animate-in slide-in-from-left duration-700 group relative">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-yellow-600/30 pb-2">
              <div className="flex items-center space-x-2">
                  <div className="p-1 bg-yellow-500/20 rounded-md">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h3 className="font-bold text-yellow-100">{offer.offerType.replace('_', ' ')}</h3>
              </div>
              <span className="text-sm font-mono text-green-400">
                  ${offer.purchasePrice.toLocaleString()}
              </span>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
              {offer.arv !== undefined && (
                <div className="col-span-2 bg-gray-800/50 p-2 rounded flex items-center justify-between border border-gray-700">
                  <span className="text-gray-400 text-[10px] uppercase">Based on ARV</span>
                  <div className="flex items-center space-x-1">
                     <TrendingUp className="w-3 h-3 text-blue-400" />
                     <span className="font-semibold text-blue-100">${offer.arv.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {offer.downPayment !== undefined && (
                <div className="bg-gray-800/50 p-2 rounded">
                  <span className="block text-gray-500 text-[10px] uppercase">Down Payment</span>
                  <span className="font-semibold text-white">${offer.downPayment.toLocaleString()}</span>
                </div>
              )}
              
              {offer.monthlyPayment !== undefined && (
                 <div className="bg-gray-800/50 p-2 rounded">
                   <span className="block text-gray-500 text-[10px] uppercase">Monthly</span>
                   <span className="font-semibold text-white">${offer.monthlyPayment.toLocaleString()}</span>
                 </div>
              )}

              {offer.interestRate !== undefined && (
                 <div className="bg-gray-800/50 p-2 rounded flex items-center space-x-2">
                   <Percent className="w-3 h-3 text-gray-500" />
                   <span className="font-semibold text-white">{offer.interestRate}% Interest</span>
                 </div>
              )}

              {offer.closingDays !== undefined && (
                 <div className="bg-gray-800/50 p-2 rounded flex items-center space-x-2">
                   <Calendar className="w-3 h-3 text-gray-500" />
                   <span className="font-semibold text-white">{offer.closingDays} Day Close</span>
                 </div>
              )}
            </div>

            {offer.contingencies && (
                <div className="mt-3 pt-2 border-t border-gray-800 flex items-start space-x-2">
                    <FileCheck className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
                    <span className="text-xs text-blue-100/80 italic">{offer.contingencies}</span>
                </div>
            )}

            {/* Email Action */}
            {onDraftEmail && (
              <div className="mt-3 pt-2 border-t border-gray-800/50 flex justify-end">
                <button 
                  onClick={() => onDraftEmail(offer)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-medium rounded-md transition-colors border border-gray-700 hover:border-gray-600"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Offer</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { OfferInfo, LeadInfo } from '../types';
import { X, Mail, Copy, Check, RefreshCw } from 'lucide-react';

interface EmailModalProps {
  offer: OfferInfo;
  lead?: LeadInfo;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ offer, lead, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Form State
  const [toEmail, setToEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // REACTIVE AUTO-FILL: Update local state if specific lead properties change (Real-time capture)
  useEffect(() => {
    if (lead) {
      if (lead.email) setToEmail(lead.email);
      if (lead.name) setRecipientName(lead.name);
      if (lead.propertyAddress) setPropertyAddress(lead.propertyAddress);
    } else {
        // Defaults if no lead
        setRecipientName('Homeowner');
        setPropertyAddress('your property');
    }
  }, [lead?.email, lead?.name, lead?.propertyAddress]);

  // Generate the email template when component mounts or data changes
  useEffect(() => {
    const addressDisplay = propertyAddress || lead?.propertyAddress || 'your property';
    const nameDisplay = recipientName || lead?.name || 'Homeowner';

    // 1. Generate Subject
    const newSubject = `Official Offer for ${addressDisplay}`;
    setSubject(newSubject);

    // 2. Generate Body based on Offer Type
    let termsSection = '';

    if (offer.purchasePrice === 0) {
        termsSection = `
[Offer Terms Pending Negotiation]
We are preparing a custom offer for your property.
        `.trim();
    } else if (offer.offerType === 'CASH') {
      termsSection = `
Purchase Price: $${offer.purchasePrice.toLocaleString()}
Closing Date: ${offer.closingDays || 30} Days
Contingencies: ${offer.contingencies || 'Standard Inspection'}
      `.trim();
    } else {
      // Creative Offers (Seller Finance, SubTo, etc)
      termsSection = `
Purchase Price: $${offer.purchasePrice.toLocaleString()}
Down Payment: $${(offer.downPayment || 0).toLocaleString()}
Monthly Payment: $${(offer.monthlyPayment || 0).toLocaleString()}
Interest Rate: ${offer.interestRate || 0}%
Term Length: ${offer.termLength || 'N/A'}
Closing Date: ${offer.closingDays || 30} Days
      `.trim();
    }

    const newBody = `Hi ${nameDisplay},

It was a pleasure speaking with you earlier. As promised, here is the written offer for ${addressDisplay}.

Based on our conversation, we have structured the following terms:

=== OFFER DETAILS (${offer.offerType.replace('_', ' ')}) ===

${termsSection}

================================

Please review these numbers. We are ready to move forward immediately upon your acceptance.

Let me know if you have any questions or if you would like to adjust any of the terms.

Best regards,

[Your Name / REI Voice Pro]
Real Estate Investor
`;

    setBody(newBody);
  }, [offer, recipientName, propertyAddress, toEmail, lead]); // Re-run if these change

  const handleSendMail = () => {
    const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Lead Capture & Offer Form</h2>
              <div className="flex items-center space-x-2">
                 <p className="text-xs text-gray-400">Auto-filling from voice conversation...</p>
                 <RefreshCw className="w-3 h-3 text-green-500 animate-spin" />
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Recipient Details (Lead Capture Form Edit) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Lead Name
              </label>
              <input 
                type="text" 
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Waiting for input..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Property Address
              </label>
              <input 
                type="text" 
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="Waiting for input..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Lead Email
              </label>
              <input 
                type="email" 
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="client@example.com (Waiting for input...)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
             {/* Subject */}
             <div className="mb-4">
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                 Subject Line
               </label>
               <input 
                 type="text" 
                 value={subject}
                 onChange={(e) => setSubject(e.target.value)}
                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
               />
             </div>

             {/* Body */}
             <div>
               <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Generated Offer / Email Body
                  </label>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
               </div>
               <textarea 
                 value={body}
                 onChange={(e) => setBody(e.target.value)}
                 className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
               />
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-800/50 border-t border-gray-800 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleSendMail}
            disabled={!toEmail}
            className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center space-x-2 ${
                toEmail 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{toEmail ? 'Draft in Email Client' : 'Capture Email First'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
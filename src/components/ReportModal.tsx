import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import { Listing, Report } from '../types';
import { useTakaStore } from '../services/store';

interface ReportModalProps {
  listing: Listing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  listing,
  onClose,
  onSuccess,
}) => {
  const { addReport } = useTakaStore();

  const [reason, setReason] = useState<Report['reason']>('hazardous_unauthorized');
  const [details, setDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      setErrorMsg('Please describe the issue in detail.');
      return;
    }

    addReport({
      targetType: 'listing',
      targetId: listing.id,
      targetTitle: listing.title,
      reason,
      details: details.trim(),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Report Listing
              </h3>
              <p className="text-xs text-white/80">
                Safety & Compliance Desk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-0.5">
            <span className="font-semibold text-gray-500 uppercase text-[10px]">Reported Listing</span>
            <p className="font-bold text-[#17324D]">{listing.title}</p>
            <p className="text-gray-500">Supplier: {listing.supplierName}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as Report['reason'])}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="hazardous_unauthorized">Hazardous / Bio-waste without NEMA permit</option>
              <option value="counterfeit_or_misrepresented">Misrepresented grade or severe contamination</option>
              <option value="scam_pricing">Suspicious pricing or advance payment demand</option>
              <option value="no_show_collection">No-show at agreed collection depot</option>
              <option value="inappropriate_conduct">Inappropriate or fraudulent conduct</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Detailed Evidence & Specifics *
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="State exactly why this listing breaches safety, legal, or environmental standards in Eldoret..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition"
            >
              Submit Report to Compliance Desk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

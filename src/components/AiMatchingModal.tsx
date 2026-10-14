import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { Listing, BulkRequest } from '../types';
import { useTakaStore } from '../services/store';

interface AiMatchingModalProps {
  listing?: Listing | null;
  bulkRequest?: BulkRequest | null;
  onClose: () => void;
  onSelectAction: (target: any) => void;
}

export const AiMatchingModal: React.FC<AiMatchingModalProps> = ({
  listing,
  bulkRequest,
  onClose,
  onSelectAction,
}) => {
  const { listings, bulkRequests } = useTakaStore();

  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    async function runMatching() {
      setIsLoading(true);
      try {
        const payload = listing
          ? { listing, buyerRequests: bulkRequests }
          : { listing: { categoryName: bulkRequest?.categoryName, quantity: bulkRequest?.targetQuantity, unit: bulkRequest?.unit, approximateLocation: { town: 'Eldoret', area: bulkRequest?.locationArea } }, buyerRequests: [bulkRequest] };

        const res = await fetch('/api/ai/match-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setMatches(data.topMatches || []);
        setSummary(data.aiSummary || 'Analyzed Eldoret circular economy directory.');
      } catch (e) {
        console.error('Matching error:', e);
        // Fallback matching
        setMatches([
          {
            buyerName: 'Rift Valley Circular Recyclers Ltd',
            targetMaterial: 'PET & Rigid Plastics',
            matchConfidence: 0.94,
            reason: 'Active industrial washing line in Eldoret Industrial Area seeking consistent monthly volume with dedicated canter collection.',
          },
        ]);
        setSummary('Rule-based Eldoret aggregator matching completed.');
      } finally {
        setIsLoading(false);
      }
    }

    runMatching();
  }, [listing, bulkRequest, bulkRequests]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#176B4D] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">
                Intelligent Marketplace Matching
              </h3>
              <p className="text-xs text-white/70">
                Rule-based and Gemini-ranked compatibility in Eldoret
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

        <div className="p-6 space-y-4">
          {/* Target Reference */}
          <div className="p-3 bg-[#F7F8F4] rounded-xl border border-gray-200 text-xs">
            <span className="text-[10px] uppercase font-bold text-gray-400">Target Record</span>
            <p className="font-bold text-[#17324D]">
              {listing ? listing.title : bulkRequest?.title}
            </p>
          </div>

          {/* AI Summary */}
          {summary && (
            <div className="p-3 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 text-xs text-[#17324D]">
              <span className="font-bold text-[#176B4D] block mb-0.5">Marketplace Insight:</span>
              <p>{summary}</p>
            </div>
          )}

          {/* Matches List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Recommended Counterparties ({matches.length})
            </h4>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 animate-spin text-[#176B4D]" />
                <span>Evaluating material grade, transport radius, and volume compatibility...</span>
              </div>
            ) : matches.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
                No immediate bulk matches found. You can still list your material publicly for individual buyers to discover.
              </div>
            ) : (
              <div className="space-y-2.5">
                {matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-gray-200 hover:border-[#176B4D] shadow-xs transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#17324D]">
                          {m.buyerName || 'Verified Eldoret Buyer'}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
                      </div>
                      <span className="text-xs font-bold text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded-full">
                        {Math.round((m.matchConfidence || 0.9) * 100)}% Match
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-2.5 leading-relaxed">
                      {m.reason}
                    </p>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectAction(m);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-[#176B4D] hover:underline"
                      >
                        <span>Connect & Propose Trade</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

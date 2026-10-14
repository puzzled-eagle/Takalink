import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Calendar,
  MapPin,
  Plus,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { BulkRequest, Listing } from '../types';
import { useTakaStore } from '../services/store';

interface BulkRequestCardProps {
  request: BulkRequest;
  onContribute: (request: BulkRequest) => void;
  onOpenAiMatching: (request: BulkRequest) => void;
}

export const BulkRequestCard: React.FC<BulkRequestCardProps> = ({
  request,
  onContribute,
  onOpenAiMatching,
}) => {
  const [showContributors, setShowContributors] = useState(false);

  const percentComplete = Math.min(
    100,
    Math.round((request.currentAggregatedQuantity / request.targetQuantity) * 100)
  );

  const statusBadges: Record<string, { label: string; badge: string }> = {
    open: { label: 'Open for Contributors', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    partially_matched: { label: 'Partially Matched', badge: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20' },
    target_reached: { label: 'Target Reached', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    confirmed: { label: 'Confirmed for Pickup', badge: 'bg-[#17324D] text-white border-transparent' },
    completed: { label: 'Completed', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
  };

  const statusInfo = statusBadges[request.status] || statusBadges.open;

  return (
    <div className="bg-white rounded-2xl border border-[#17324D]/10 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B4D] bg-[#176B4D]/10 px-2.5 py-0.5 rounded-full">
              {request.categoryName}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Target: {new Date(request.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#17324D] leading-snug mb-1 font-heading">
          {request.title}
        </h3>

        {/* Buyer info */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4">
          <span className="font-semibold text-[#17324D]">{request.buyerName}</span>
          {request.buyerVerified && (
            <span title="Verified Recycler / Commercial Buyer" className="inline-flex">
              <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
            </span>
          )}
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1 text-gray-500">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{request.locationArea}</span>
          </span>
        </div>

        {/* Aggregation Progress Bar */}
        <div className="p-3.5 bg-[#F7F8F4] rounded-xl border border-gray-200/80 mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-500">
              Aggregated:{' '}
              <strong className="text-[#17324D]">
                {request.currentAggregatedQuantity.toLocaleString()} {request.unit}
              </strong>
            </span>
            <span className="text-gray-500">
              Goal: <strong className="text-[#17324D]">{request.targetQuantity.toLocaleString()} {request.unit}</strong>
            </span>
          </div>

          {/* Bar */}
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#176B4D] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
            <span className="font-bold text-[#176B4D]">{percentComplete}% of target pooled</span>
            <span>
              Target Price:{' '}
              <strong className="text-[#17324D]">KES {request.targetPricePerUnit} / {request.unit}</strong>
            </span>
          </div>
        </div>

        {/* Quality requirements */}
        <div className="text-xs text-gray-600 space-y-1 mb-4">
          <p>
            <strong className="text-[#17324D]">Quality Specs:</strong> {request.qualityRequirements}
          </p>
          <p>
            <strong className="text-[#17324D]">Max Contamination:</strong> {request.maxContaminationAcceptable}
          </p>
        </div>

        {/* Existing Contributors Accordion */}
        {request.contributions.length > 0 && (
          <div className="mb-4 border-t border-gray-100 pt-3">
            <button
              onClick={() => setShowContributors(!showContributors)}
              className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-[#17324D] font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>{request.contributions.length} Suppliers Contributing</span>
              </span>
              {showContributors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showContributors && (
              <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-[#176B4D]/30 py-1">
                {request.contributions.map((c) => (
                  <div key={c.id} className="text-[11px] flex items-center justify-between text-gray-600">
                    <span className="font-medium text-[#17324D]">{c.supplierName} ({c.supplierArea})</span>
                    <span>+{c.proposedQuantity} {c.unit} @ KES {c.agreedPricePerUnit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100">
        <button
          onClick={() => onOpenAiMatching(request)}
          className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-[#176B4D] hover:bg-[#176B4D]/10 rounded-lg transition flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#176B4D]" />
          <span>AI Matching</span>
        </button>

        <button
          onClick={() => onContribute(request)}
          disabled={request.status === 'completed' || percentComplete >= 100}
          className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            percentComplete >= 100
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#176B4D] text-white hover:bg-[#176B4D]/90 shadow-sm'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Contribute My Waste</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Sparkles,
  Info,
  ShieldCheck,
  TrendingUp,
  Search,
} from 'lucide-react';
import { BulkRequest, Listing } from '../types';
import { useTakaStore } from '../services/store';
import { BulkRequestCard } from '../components/BulkRequestCard';
import { ContributeBulkModal } from '../components/ContributeBulkModal';
import { CreateBulkModal } from '../components/CreateBulkModal';
import { AiMatchingModal } from '../components/AiMatchingModal';

interface BulkRequestsViewProps {
  onOpenAiAssistant: () => void;
}

export const BulkRequestsView: React.FC<BulkRequestsViewProps> = ({
  onOpenAiAssistant,
}) => {
  const { bulkRequests, currentUser, theme } = useTakaStore();

  const [selectedRequestForContribution, setSelectedRequestForContribution] = useState<BulkRequest | null>(null);
  const [selectedRequestForAi, setSelectedRequestForAi] = useState<BulkRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredRequests = bulkRequests.filter((r) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.categoryName.toLowerCase().includes(q) ||
      r.buyerName.toLowerCase().includes(q) ||
      r.locationArea.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 py-6">
      {/* Top Explanation Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-xs transition-colors ${
          theme === 'light'
            ? 'bg-white text-[#17324D] border-[#E5E9ED]'
            : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20 shadow-md'
        }`}
      >
        <div className="max-w-3xl space-y-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              theme === 'light'
                ? 'bg-[#176B4D]/10 border border-[#176B4D]/30 text-[#176B4D]'
                : 'bg-[#176B4D]/30 border border-[#176B4D]/50 text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#176B4D]" />
            <span>Circular Economy Feature: Small-Quantity Sourcing Aggregation</span>
          </div>

          <h1 className={`text-xl sm:text-3xl font-extrabold font-heading leading-tight ${theme === 'light' ? 'text-[#17324D]' : 'text-white'}`}>
            Bulk Aggregation Pools
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'light' ? 'text-[#536575]' : 'text-white/80'}`}>
            Recyclers and commercial mills in Eldoret often require large minimum volumes (e.g. 5,000 kg to 20,000 kg).
            TakaLink allows individual households, shops, and community collectors with smaller batches (100 kg to 800 kg) to pool compatible materials together, unlock bulk industrial pricing, and share consolidated transport.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#176B4D] text-white text-xs font-bold hover:bg-[#176B4D]/90 shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Bulk Procurement Pool</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-[#F7F8F4] hover:bg-[#E5E9ED] text-[#17324D] border border-[#E5E9ED]'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#176B4D]" />
              <span>How Aggregation Pricing Works</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E9ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#536575]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search pools by material, buyer, or depot..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E5E9ED] rounded-xl bg-[#F7F8F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D] text-[#17324D]"
          />
        </div>

        <div className="text-xs text-[#536575]">
          Active Pools: <strong className="text-[#17324D]">{filteredRequests.length}</strong> in Eldoret
        </div>
      </div>

      {/* Pools Grid */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E9ED] space-y-2">
          <Layers className="w-8 h-8 text-[#536575] mx-auto" />
          <h3 className="text-sm font-bold text-[#17324D]">No active bulk pools found</h3>
          <p className="text-xs text-[#536575]">Be the first commercial buyer to initiate an aggregation pool.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <BulkRequestCard
              key={req.id}
              request={req}
              onContribute={(r) => setSelectedRequestForContribution(r)}
              onOpenAiMatching={(r) => setSelectedRequestForAi(r)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedRequestForContribution && (
        <ContributeBulkModal
          request={selectedRequestForContribution}
          onClose={() => setSelectedRequestForContribution(null)}
          onSuccess={() => setSelectedRequestForContribution(null)}
        />
      )}

      {showCreateModal && (
        <CreateBulkModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

      {selectedRequestForAi && (
        <AiMatchingModal
          bulkRequest={selectedRequestForAi}
          onClose={() => setSelectedRequestForAi(null)}
          onSelectAction={() => {
            setSelectedRequestForContribution(selectedRequestForAi);
            setSelectedRequestForAi(null);
          }}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Truck,
  PlusCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { TransportJob } from '../types';
import { useTakaStore } from '../services/store';
import { LogisticsJobCard } from '../components/LogisticsJobCard';
import { SubmitQuoteModal } from '../components/SubmitQuoteModal';
import { CreateLogisticsJobModal } from '../components/CreateLogisticsJobModal';

export const LogisticsView: React.FC = () => {
  const { transportJobs, currentRole } = useTakaStore();

  const [selectedJobForQuote, setSelectedJobForQuote] = useState<TransportJob | null>(null);
  const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredJobs = transportJobs.filter((job) => {
    if (statusFilter === 'all') return true;
    return job.status === statusFilter;
  });

  return (
    <div className="space-y-6 py-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9ED] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#176B4D]/10 text-[#176B4D] text-xs font-bold mb-1">
            <Truck className="w-3.5 h-3.5" />
            <span>NEMA-Compliant Recyclable Logistics Hub • Eldoret</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] font-heading">
            Collection & Logistics Board
          </h1>
          <p className="text-xs text-[#536575]">
            Connect verified suppliers and buyers with licensed Eldoret cargo haulers
          </p>
        </div>

        <button
          onClick={() => setShowCreateJobModal(true)}
          className="px-4 py-2.5 bg-[#176B4D] hover:bg-[#176B4D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Waste Haulage</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E5E9ED] text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="font-semibold text-[#536575] shrink-0">Status:</span>
          {['all', 'open_for_quotes', 'assigned', 'in_transit', 'delivered', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize font-medium shrink-0 transition ${
                statusFilter === st
                  ? 'bg-[#17324D] text-white'
                  : 'bg-[#F7F8F4] text-[#536575] hover:bg-[#E5E9ED]'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <span className="text-[#536575] text-xs shrink-0">
          <strong className="text-[#17324D]">{filteredJobs.length}</strong> Job{filteredJobs.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E9ED] space-y-2">
          <Truck className="w-8 h-8 text-[#536575] mx-auto" />
          <h3 className="text-sm font-bold text-[#17324D]">No transport jobs found</h3>
          <p className="text-xs text-[#536575]">There are currently no haulage jobs under this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <LogisticsJobCard
              key={job.id}
              job={job}
              onSubmitQuote={(j) => setSelectedJobForQuote(j)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedJobForQuote && (
        <SubmitQuoteModal
          job={selectedJobForQuote}
          onClose={() => setSelectedJobForQuote(null)}
          onSuccess={() => setSelectedJobForQuote(null)}
        />
      )}

      {showCreateJobModal && (
        <CreateLogisticsJobModal
          isOpen={showCreateJobModal}
          onClose={() => setShowCreateJobModal(false)}
          onSuccess={() => setShowCreateJobModal(false)}
        />
      )}
    </div>
  );
};

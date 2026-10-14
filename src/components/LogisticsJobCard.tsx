import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { TransportJob } from '../types';
import { useTakaStore } from '../services/store';

interface LogisticsJobCardProps {
  job: TransportJob;
  onSubmitQuote: (job: TransportJob) => void;
}

export const LogisticsJobCard: React.FC<LogisticsJobCardProps> = ({
  job,
  onSubmitQuote,
}) => {
  const {
    currentUser,
    currentRole,
    acceptTransportQuote,
    advanceTransportStatus,
  } = useTakaStore();

  const [deliveryNote, setDeliveryNote] = useState('');
  const [showDeliveryPrompt, setShowDeliveryPrompt] = useState(false);

  const vehicleLabels: Record<string, string> = {
    motorcycle_cargo: 'Cargo Motorcycle (3-Wheeler)',
    tuk_tuk: 'Closed Cargo Tuk-Tuk',
    pickup_truck: '1-Tonne Pickup Truck',
    canter_3ton: '3-Tonne Isuzu Canter (Tarpaulin)',
    tipper_lorry: 'Heavy Tipper / Dump Lorry',
    flatbed: 'Flatbed Heavy Hauler',
  };

  const statusBadges: Record<string, { label: string; badge: string }> = {
    open_for_quotes: { label: 'Open for Quotes', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    assigned: { label: 'Assigned to Transporter', badge: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20' },
    in_transit: { label: 'In Transit / Loaded', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    delivered: { label: 'Delivered at Weighbridge', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    completed: { label: 'Completed', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
  };

  const statusInfo = statusBadges[job.status] || statusBadges.open_for_quotes;

  const isRequester = currentUser.id === job.requesterId;
  const isAssignedTransporter = currentUser.id === job.assignedTransporterId;

  return (
    <div className="bg-white rounded-2xl border border-[#17324D]/10 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-semibold text-[#17324D]">{job.requesterName}</span>
            <span className="text-gray-300">•</span>
            <span className="capitalize">{job.requesterRole}</span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badge}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Cargo Summary */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-[#17324D] font-heading leading-tight">
              {job.quantity.toLocaleString()} {job.unit} of {job.materialName}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-[#176B4D] font-semibold mt-0.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Vehicle Required: {vehicleLabels[job.vehicleRequirement] || job.vehicleRequirement}</span>
            </span>
          </div>
        </div>

        {/* Route Card */}
        <div className="p-3.5 bg-[#F7F8F4] rounded-xl border border-gray-200/70 mb-4 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#176B4D] mt-1 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Pickup Hub</span>
              <p className="font-bold text-[#17324D]">{job.pickupArea}</p>
              <p className="text-[11px] text-gray-500">{job.pickupAddressApprox}</p>
            </div>
          </div>

          <div className="border-l-2 border-dashed border-gray-300 ml-1 pl-3 py-1">
            <span className="text-[10px] text-gray-400">Haulage route across Eldoret</span>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#17324D] mt-1 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Delivery Destination</span>
              <p className="font-bold text-[#17324D]">{job.deliveryArea}</p>
              <p className="text-[11px] text-gray-500">{job.deliveryAddressApprox}</p>
            </div>
          </div>
        </div>

        {/* Schedule & Notes */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Target: {job.preferredDate}</span>
          </span>
          {job.agreedFee && (
            <span className="font-extrabold text-[#176B4D] text-sm">
              Agreed Fee: KES {job.agreedFee.toLocaleString()}
            </span>
          )}
        </div>

        {job.notes && (
          <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 mb-4 italic">
            "{job.notes}"
          </p>
        )}

        {/* Assigned Transporter Banner if assigned */}
        {job.assignedTransporterName && (
          <div className="p-3 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 text-xs mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#176B4D]" />
              <div>
                <span className="font-bold text-[#17324D]">Assigned: {job.assignedTransporterName}</span>
                <p className="text-[10px] text-gray-500">NEMA Certified Waste Logistics</p>
              </div>
            </div>
            {job.pickupProofNote && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Verified Loaded
              </span>
            )}
          </div>
        )}

        {/* Quotes list for Requester */}
        {job.quotes.length > 0 && job.status === 'open_for_quotes' && (
          <div className="mb-4 border-t border-gray-100 pt-3">
            <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider mb-2">
              Received Quotes ({job.quotes.length})
            </h4>
            <div className="space-y-2">
              {job.quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#17324D]">{q.transporterName}</span>
                    <p className="text-[11px] text-gray-500">
                      {vehicleLabels[q.vehicleType] || q.vehicleType} • {q.availabilityNotes}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#176B4D] text-sm">
                      KES {q.quoteAmount.toLocaleString()}
                    </span>
                    {isRequester && (
                      <button
                        onClick={() => acceptTransportQuote(job.id, q.id)}
                        className="px-2.5 py-1 bg-[#176B4D] text-white text-[11px] font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div className="pt-2 border-t border-gray-100">
        {/* If Transporter viewing open job */}
        {job.status === 'open_for_quotes' && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">
              Quotes open to Eldoret licensed haulers
            </span>
            <button
              onClick={() => onSubmitQuote(job)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-sm transition"
            >
              Submit Transport Quote
            </button>
          </div>
        )}

        {/* If assigned and advancing statuses */}
        {job.status === 'assigned' && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">Transporter dispatched for loading</span>
            <button
              onClick={() => advanceTransportStatus(job.id, 'in_transit', { proof: 'Loaded at Eldoret hub scale' })}
              className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
            >
              Confirm Loaded & In-Transit
            </button>
          </div>
        )}

        {job.status === 'in_transit' && (
          <div className="space-y-2">
            {!showDeliveryPrompt ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500">Haulage in transit to delivery depot</span>
                <button
                  onClick={() => setShowDeliveryPrompt(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-sm transition"
                >
                  Record Delivery at Depot
                </button>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-[#17324D]">
                  Weighbridge / Delivery Ticket Reference
                </label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Weighbridge Ticket #UG-2026-9812 (Net wt. verified)"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeliveryPrompt(false)}
                    className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      advanceTransportStatus(job.id, 'delivered', {
                        proof: deliveryNote || 'Offloaded and signed at factory depot',
                      });
                      setShowDeliveryPrompt(false);
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-[#176B4D] rounded-lg"
                  >
                    Confirm Delivery
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {job.status === 'delivered' && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-emerald-800 font-semibold">
              Delivered • {job.deliveryProofNote || 'Weighbridge scale ticket registered'}
            </span>
            <button
              onClick={() => advanceTransportStatus(job.id, 'completed')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#17324D]/90 rounded-xl shadow-sm transition"
            >
              Sign-Off & Close Job
            </button>
          </div>
        )}

        {job.status === 'completed' && (
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Job successfully closed and logistics logged.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { Offer, UserRole } from '../types';
import { useTakaStore } from '../services/store';

interface OffersViewProps {
  onOpenCreateTransportJob?: (offer: Offer) => void;
}

export const OffersView: React.FC<OffersViewProps> = () => {
  const {
    offers,
    currentUser,
    currentRole,
    respondToOffer,
    advanceOfferStatus,
  } = useTakaStore();

  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || '');
  const [showCounterForm, setShowCounterForm] = useState<boolean>(false);
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [counterNotes, setCounterNotes] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const activeOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  const statusBadges: Record<string, { label: string; badge: string }> = {
    inquiry: { label: 'Inquiry', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    offer_submitted: { label: 'Offer Submitted', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    counteroffer: { label: 'Counteroffer Pending', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    accepted: { label: 'Offer Accepted', badge: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20' },
    rejected: { label: 'Declined', badge: 'bg-red-50 text-red-700 border-red-200' },
    awaiting_collection: { label: 'Awaiting Collection', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    collection_scheduled: { label: 'Collection Scheduled', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
    picked_up: { label: 'Picked Up', badge: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    delivered: { label: 'Delivered', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    completed: { label: 'Completed', badge: 'bg-[#17324D] text-white border-transparent' },
    cancelled: { label: 'Cancelled', badge: 'bg-gray-100 text-gray-700 border-gray-300' },
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (counterPrice <= 0) return;
    respondToOffer(activeOffer.id, 'counter', {
      pricePerUnit: Number(counterPrice),
      notes: counterNotes.trim() || 'Counteroffer proposed.',
    });
    setShowCounterForm(false);
  };

  const isSupplier = currentUser.id === activeOffer?.supplierId;
  const isBuyer = currentUser.id === activeOffer?.buyerId;

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E9ED] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] font-heading">
          Offer Negotiations & Transactions
        </h1>
        <p className="text-xs text-[#536575]">
          Track bilateral counterparty offers, price agreements, and collection milestones in KES
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-[#E5E9ED]">
          <DollarSign className="w-10 h-10 text-[#536575] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#17324D]">No active offers or negotiations yet</h3>
          <p className="text-xs text-[#536575]">Browse the marketplace and submit an offer to initiate a deal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: List of Offers */}
          <div className="bg-white rounded-2xl border border-[#E5E9ED] shadow-xs p-4 space-y-2 h-[750px] overflow-y-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-[#536575] px-2 py-1">
              Active Negotiations ({offers.length})
            </div>

            {offers.map((offer) => {
              const stInfo = statusBadges[offer.status] || statusBadges.offer_submitted;
              const isSelected = offer.id === activeOffer?.id;

              return (
                <div
                  key={offer.id}
                  onClick={() => {
                    setSelectedOfferId(offer.id);
                    setShowCounterForm(false);
                  }}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-[#176B4D] bg-[#176B4D]/5 shadow-xs'
                      : 'border-[#E5E9ED] hover:border-[#176B4D] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-[#17324D] truncate max-w-[170px]">
                      {offer.listingTitle}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${stInfo.badge}`}>
                      {stInfo.label}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#536575] flex items-center justify-between">
                    <span>
                      {offer.buyerName} ➔ {offer.supplierName}
                    </span>
                    <span className="font-bold text-[#176B4D]">
                      KES {offer.totalEstimatedValue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#536575] mt-1 block">
                    Rate: KES {offer.pricePerUnit}/{offer.unit} • {offer.quantity} {offer.unit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Negotiation Workspace */}
          {activeOffer && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E9ED] shadow-xs p-6 space-y-6">
              {/* Top Summary Banner */}
              <div className="p-4 bg-[#F7F8F4] rounded-xl border border-[#E5E9ED] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#176B4D] tracking-wider">
                      {activeOffer.categoryName} Batch
                    </span>
                    <h2 className="text-lg font-bold text-[#17324D] font-heading">
                      {activeOffer.listingTitle}
                    </h2>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadges[activeOffer.status]?.badge || ''}`}>
                    {statusBadges[activeOffer.status]?.label || activeOffer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[#536575] block text-[10px] uppercase">Offered Quantity</span>
                    <strong className="text-[#17324D]">{activeOffer.quantity.toLocaleString()} {activeOffer.unit}</strong>
                  </div>
                  <div>
                    <span className="text-[#536575] block text-[10px] uppercase">Price Rate</span>
                    <strong className="text-[#176B4D]">KES {activeOffer.pricePerUnit} / {activeOffer.unit}</strong>
                  </div>
                  <div>
                    <span className="text-[#536575] block text-[10px] uppercase">Total Value</span>
                    <strong className="text-[#17324D]">KES {activeOffer.totalEstimatedValue.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[#536575] block text-[10px] uppercase">Target Date</span>
                    <strong className="text-[#17324D]">{activeOffer.proposedCollectionDate || 'Flexible'}</strong>
                  </div>
                </div>
              </div>

              {/* Counterparties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl border border-[#E5E9ED] bg-white">
                  <span className="text-[10px] uppercase font-bold text-[#536575] block">Waste Supplier</span>
                  <p className="font-bold text-sm text-[#17324D]">{activeOffer.supplierName}</p>
                  <p className="text-[#536575] text-[11px]">Listing Owner • West Indies Depot</p>
                </div>
                <div className="p-3 rounded-xl border border-[#E5E9ED] bg-white">
                  <span className="text-[10px] uppercase font-bold text-[#536575] block">Buyer / Recycler</span>
                  <p className="font-bold text-sm text-[#17324D]">{activeOffer.buyerName}</p>
                  <p className="text-[#536575] text-[11px]">Procurement Desk • Industrial Area</p>
                </div>
              </div>

              {/* Offer Response Actions */}
              {(activeOffer.status === 'offer_submitted' || activeOffer.status === 'counteroffer') && (
                <div className="p-4 bg-white rounded-xl border border-[#E5E9ED] space-y-3">
                  <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider">
                    Counterparty Decision Controls
                  </h4>

                  {!showCounterForm ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => respondToOffer(activeOffer.id, 'accept')}
                        className="px-4 py-2 bg-[#176B4D] hover:bg-[#176B4D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Offer (KES {activeOffer.pricePerUnit}/{activeOffer.unit})</span>
                      </button>

                      <button
                        onClick={() => {
                          setCounterPrice(activeOffer.pricePerUnit);
                          setShowCounterForm(true);
                        }}
                        className="px-4 py-2 bg-[#17324D] hover:bg-[#17324D]/90 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Make Counteroffer</span>
                      </button>

                      <button
                        onClick={() => respondToOffer(activeOffer.id, 'reject')}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Offer</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendCounter} className="p-3 bg-[#F7F8F4] rounded-xl border border-[#E5E9ED] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#17324D]">Propose Revised Terms</span>
                        <button
                          type="button"
                          onClick={() => setShowCounterForm(false)}
                          className="text-xs text-[#536575] hover:text-[#17324D]"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#17324D] mb-1">
                            Counter Price (KES/{activeOffer.unit})
                          </label>
                          <input
                            type="number"
                            min="0.5"
                            step="any"
                            value={counterPrice}
                            onChange={(e) => setCounterPrice(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs border border-[#E5E9ED] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D] text-[#17324D]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#17324D] mb-1">
                            Revised Total
                          </label>
                          <div className="px-3 py-1.5 text-xs font-bold text-[#176B4D] bg-white border border-[#E5E9ED] rounded-lg">
                            KES {(activeOffer.quantity * counterPrice).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#17324D] mb-1">
                          Counteroffer Justification
                        </label>
                        <input
                          type="text"
                          value={counterNotes}
                          onChange={(e) => setCounterNotes(e.target.value)}
                          placeholder="e.g. Can do KES 14 minimum due to wire-tied baling costs."
                          className="w-full px-3 py-1.5 text-xs border border-[#E5E9ED] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D] text-[#17324D]"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowCounterForm(false)}
                          className="px-3 py-1 text-xs text-[#536575] hover:bg-[#E5E9ED] rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-lg shadow-xs"
                        >
                          Send Counteroffer
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Post-Acceptance Milestone Actions */}
              {activeOffer.status === 'accepted' && (
                <div className="p-4 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#176B4D]" />
                    <span className="font-bold text-sm text-[#17324D]">
                      Offer Confirmed! Next: Coordinate Collection
                    </span>
                  </div>
                  <p className="text-xs text-[#536575]">
                    Both parties have agreed on terms. You can now arrange your own collection or post a transport request to Eldoret haulers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => advanceOfferStatus(activeOffer.id, 'collection_scheduled', 'Collection truck dispatched')}
                      className="px-3 py-1.5 bg-[#176B4D] text-white text-xs font-bold rounded-lg hover:bg-[#176B4D]/90 transition"
                    >
                      Schedule Pickup Window
                    </button>
                    <button
                      onClick={() => advanceOfferStatus(activeOffer.id, 'completed', 'Weighbridge slip signed and settled')}
                      className="px-3 py-1.5 bg-[#17324D] text-white text-xs font-bold rounded-lg hover:bg-[#17324D]/90 transition"
                    >
                      Mark Transaction Completed
                    </button>
                  </div>
                </div>
              )}

              {/* History / Audit Timeline */}
              <div>
                <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#176B4D]" />
                  <span>Negotiation Timeline & Audit Log</span>
                </h4>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#E5E9ED]">
                  {activeOffer.history.map((event, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-6 text-xs">
                      <div className="absolute left-2 top-1.5 w-2.5 h-2.5 rounded-full bg-[#176B4D] ring-4 ring-white" />
                      <div className="p-3 bg-[#F7F8F4] rounded-xl border border-[#E5E9ED] w-full space-y-1">
                        <div className="flex items-center justify-between text-[#536575]">
                          <span className="font-bold text-[#17324D]">{event.actorName}</span>
                          <span className="text-[10px]">
                            {new Date(event.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} • {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-semibold text-[#176B4D]">{event.action}</p>
                        {event.note && (
                          <p className="text-[#536575] italic">"{event.note}"</p>
                        )}
                        {event.pricePerUnit && (
                          <span className="inline-block text-[10px] font-bold text-[#17324D] bg-white px-2 py-0.5 rounded border border-[#E5E9ED]">
                            KES {event.pricePerUnit}/{activeOffer.unit}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

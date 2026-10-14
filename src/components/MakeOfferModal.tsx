import React, { useState } from 'react';
import { X, DollarSign, Calendar, AlertCircle, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';
import { useTakaStore } from '../services/store';

interface MakeOfferModalProps {
  listing: Listing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  listing,
  onClose,
  onSuccess,
}) => {
  const { currentUser, createOffer } = useTakaStore();

  const [quantity, setQuantity] = useState<number>(listing?.quantity || 100);
  const [pricePerUnit, setPricePerUnit] = useState<number>(
    listing?.askingPricePerUnit && listing.askingPricePerUnit > 0
      ? listing.askingPricePerUnit
      : 25
  );
  const [proposedCollectionDate, setProposedCollectionDate] = useState<string>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!listing) return null;

  const totalValue = Math.round(quantity * pricePerUnit * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }
    if (pricePerUnit <= 0) {
      setErrorMsg('Offer price must be greater than zero.');
      return;
    }

    try {
      createOffer({
        listingId: listing.id,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit),
        proposedCollectionDate,
        notes: notes.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit offer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading">
              Make an Offer
            </h3>
            <p className="text-xs text-white/70">
              Direct counterparty proposal to {listing.supplierName}
            </p>
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
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Target Listing Summary */}
          <div className="p-3 bg-[#F7F8F4] rounded-xl border border-gray-200 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Target Material</span>
            <p className="font-bold text-[#17324D] line-clamp-1">{listing.title}</p>
            <div className="flex items-center justify-between text-gray-500 pt-1">
              <span>Available: {listing.quantity} {listing.unit}</span>
              <span>
                Asking:{' '}
                {listing.askingPricePerUnit > 0
                  ? `KES ${listing.askingPricePerUnit} / ${listing.unit}`
                  : 'Offers Invited'}
              </span>
            </div>
          </div>

          {/* Offer Quantity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Quantity ({listing.unit}) *
              </label>
              <input
                type="number"
                min="1"
                max={listing.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
              <span className="text-[10px] text-gray-400">Max: {listing.quantity} {listing.unit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Your Price (KES / {listing.unit}) *
              </label>
              <input
                type="number"
                min="0.5"
                step="any"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
              <span className="text-[10px] text-gray-400">Proposed unit rate</span>
            </div>
          </div>

          {/* Calculated Total Card */}
          <div className="p-3.5 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#176B4D]">
                Total Offer Value
              </span>
              <p className="text-lg font-extrabold text-[#17324D]">
                KES {totalValue.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <span>{quantity} {listing.unit} × KES {pricePerUnit}</span>
            </div>
          </div>

          {/* Proposed Date */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Proposed Collection Date
            </label>
            <input
              type="date"
              value={proposedCollectionDate}
              onChange={(e) => setProposedCollectionDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Logistics & Collection Proposal
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. We will send our own canter truck from Industrial Area. Please have bales weighed on scale."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
          </div>

          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
            <strong>TakaLink Trust Policy:</strong> Submitting an offer does not transfer payment or release material. If accepted, both parties coordinate physical weighbridge verification and pickup.
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-md transition"
            >
              Send Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

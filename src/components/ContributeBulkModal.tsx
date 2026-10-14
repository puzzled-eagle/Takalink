import React, { useState } from 'react';
import { X, Layers, AlertCircle, CheckCircle } from 'lucide-react';
import { BulkRequest, Listing } from '../types';
import { useTakaStore } from '../services/store';

interface ContributeBulkModalProps {
  request: BulkRequest | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContributeBulkModal: React.FC<ContributeBulkModalProps> = ({
  request,
  onClose,
  onSuccess,
}) => {
  const { listings, currentUser, contributeToBulkRequest } = useTakaStore();

  // Find supplier's compatible listings
  const myListings = listings.filter((l) => l.supplierId === currentUser.id);

  const [selectedListingId, setSelectedListingId] = useState<string>(myListings[0]?.id || '');
  const [pledgedQuantity, setPledgedQuantity] = useState<number>(100);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!request) return null;

  const selectedListing = myListings.find((l) => l.id === selectedListingId);

  const remainingNeeded = Math.max(0, request.targetQuantity - request.currentAggregatedQuantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId) {
      setErrorMsg('Please select one of your listings to contribute from.');
      return;
    }
    if (pledgedQuantity <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }
    if (selectedListing && pledgedQuantity > selectedListing.quantity) {
      setErrorMsg(`Cannot pledge more than your listing available quantity (${selectedListing.quantity} ${selectedListing.unit}).`);
      return;
    }

    try {
      contributeToBulkRequest(request.id, selectedListingId, Number(pledgedQuantity));
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to contribute to bulk pool.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#176B4D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading">
              Join Aggregation Pool
            </h3>
            <p className="text-xs text-white/80">
              Combine your quantity with fellow Eldoret suppliers
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

          {/* Bulk Target Info */}
          <div className="p-3 bg-[#F7F8F4] rounded-xl border border-gray-200 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#176B4D]">
              Bulk Buyer Goal
            </span>
            <p className="font-bold text-[#17324D]">{request.title}</p>
            <div className="flex items-center justify-between text-gray-600 pt-1">
              <span>Remaining Needed: <strong>{remainingNeeded.toLocaleString()} {request.unit}</strong></span>
              <span>Buyer Rate: <strong>KES {request.targetPricePerUnit} / {request.unit}</strong></span>
            </div>
          </div>

          {/* Select Source Listing */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Select Your Waste Listing *
            </label>
            {myListings.length === 0 ? (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                You do not have any active listings yet under <strong>{currentUser.businessName || currentUser.fullName}</strong>. Please create a listing first or switch persona.
              </div>
            ) : (
              <select
                value={selectedListingId}
                onChange={(e) => {
                  setSelectedListingId(e.target.value);
                  const sel = myListings.find((l) => l.id === e.target.value);
                  if (sel) setPledgedQuantity(Math.min(sel.quantity, remainingNeeded));
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {myListings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.quantity} {l.unit} available)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Pledged Quantity */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Pledged Contribution ({request.unit}) *
            </label>
            <input
              type="number"
              min="1"
              max={selectedListing?.quantity || remainingNeeded}
              value={pledgedQuantity}
              onChange={(e) => setPledgedQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              required
            />
          </div>

          {/* Estimated Payout */}
          <div className="p-3 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#17324D]">Your Expected Proceeds:</span>
            <span className="text-sm font-extrabold text-[#176B4D]">
              KES {(pledgedQuantity * request.targetPricePerUnit).toLocaleString()}
            </span>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-500 leading-tight">
            Transparent pooling: Once the full bulk quota is met, TakaLink coordinates consolidated collection to minimize transport friction for all contributors.
          </p>

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
              disabled={myListings.length === 0}
              className="px-6 py-2 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-md transition disabled:opacity-50"
            >
              Confirm Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

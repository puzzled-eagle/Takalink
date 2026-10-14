import React, { useState } from 'react';
import { X, Truck, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { TransportJob, VehicleRequirement } from '../types';
import { useTakaStore } from '../services/store';

interface SubmitQuoteModalProps {
  job: TransportJob | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitQuoteModal: React.FC<SubmitQuoteModalProps> = ({
  job,
  onClose,
  onSuccess,
}) => {
  const { currentUser, submitTransportQuote } = useTakaStore();

  const [vehicleType, setVehicleType] = useState<VehicleRequirement>(
    job?.vehicleRequirement || 'canter_3ton'
  );
  const [quoteAmount, setQuoteAmount] = useState<number>(3800);
  const [estimatedHours, setEstimatedHours] = useState<number>(2.5);
  const [availabilityNotes, setAvailabilityNotes] = useState<string>(
    'Ready with 3-ton Isuzu Canter and heavy waterproof tarpaulin. Driver has NEMA transport badge.'
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteAmount <= 0) {
      setErrorMsg('Quote fee must be greater than zero.');
      return;
    }

    try {
      submitTransportQuote({
        jobId: job.id,
        vehicleType,
        quoteAmount: Number(quoteAmount),
        estimatedHours: Number(estimatedHours),
        availabilityNotes: availabilityNotes.trim(),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit transport quote.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading">
              Submit Haulage Quote
            </h3>
            <p className="text-xs text-white/70">
              Provide your freight estimate for {job.materialName}
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

          {/* Job Route summary */}
          <div className="p-3 bg-[#F7F8F4] rounded-xl border border-gray-200 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400">Target Route</span>
            <p className="font-bold text-[#17324D]">
              {job.pickupArea} ➔ {job.deliveryArea}
            </p>
            <p className="text-gray-500">
              Load: {job.quantity.toLocaleString()} {job.unit} of {job.materialName}
            </p>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Vehicle Dedicated to Job *
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as VehicleRequirement)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            >
              <option value="canter_3ton">3-Tonne Isuzu Canter (Tarpaulin Cover)</option>
              <option value="pickup_truck">1-Tonne Pickup Truck</option>
              <option value="tipper_lorry">Heavy Tipper / Dump Lorry</option>
              <option value="tuk_tuk">Cargo Tuk-Tuk</option>
              <option value="flatbed">Flatbed Heavy Hauler</option>
            </select>
          </div>

          {/* Quote Amount KES & Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Your Quoted Fee (KES) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
              <span className="text-[10px] text-gray-400">Total freight fee</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Est. Turnaround (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>
          </div>

          {/* Availability Notes */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Availability & Handling Details
            </label>
            <textarea
              rows={3}
              value={availabilityNotes}
              onChange={(e) => setAvailabilityNotes(e.target.value)}
              placeholder="e.g. Can load from West Indies early morning. Truck equipped with tarpaulin and strapping."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
            />
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
              Submit Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

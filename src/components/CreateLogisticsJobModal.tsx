import React, { useState } from 'react';
import { X, Truck, AlertCircle } from 'lucide-react';
import { VehicleRequirement } from '../types';
import { useTakaStore } from '../services/store';

interface CreateLogisticsJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ELDORET_ZONES = [
  'West Indies, Eldoret',
  'Eldoret CBD Wholesale Market',
  'Industrial Area (Depot), Eldoret',
  'Huruma, Eldoret',
  'Langas, Eldoret',
  'Pioneer, Eldoret',
  'Kapsoya, Eldoret',
  'Maili Nne, Eldoret',
  'Webuye Highway Depot, Eldoret',
  'Kipkenyo Composting Farm, Eldoret',
  'Turbo Road Corridor',
];

export const CreateLogisticsJobModal: React.FC<CreateLogisticsJobModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createTransportJob } = useTakaStore();

  const [materialName, setMaterialName] = useState('Sorted PET Plastic Bales');
  const [quantity, setQuantity] = useState<number>(1200);
  const [unit, setUnit] = useState<string>('kg');
  const [pickupArea, setPickupArea] = useState(ELDORET_ZONES[0]);
  const [deliveryArea, setDeliveryArea] = useState(ELDORET_ZONES[2]);
  const [pickupAddressApprox, setPickupAddressApprox] = useState('West Indies Aggregation Shed');
  const [deliveryAddressApprox, setDeliveryAddressApprox] = useState('Central Industrial Area Weighbridge');
  const [vehicleRequirement, setVehicleRequirement] = useState<VehicleRequirement>('canter_3ton');
  const [preferredDate, setPreferredDate] = useState('Tomorrow 09:00 AM');
  const [notes, setNotes] = useState('Load must be protected with rainproof tarpaulin.');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialName.trim()) {
      setErrorMsg('Please enter the material to transport.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    try {
      createTransportJob({
        materialName: materialName.trim(),
        quantity: Number(quantity),
        unit,
        pickupArea,
        deliveryArea,
        pickupAddressApprox: pickupAddressApprox.trim(),
        deliveryAddressApprox: deliveryAddressApprox.trim(),
        vehicleRequirement,
        preferredDate,
        notes: notes.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post transport request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#17324D]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-heading">
              Request Waste Transport
            </h3>
            <p className="text-xs text-white/70">
              Broadcast haulage request to licensed Eldoret transporters
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

          {/* Material & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Material Name *
              </label>
              <input
                type="text"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Quantity ({unit}) *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
                required
              />
            </div>
          </div>

          {/* Pickup and Delivery Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Pickup Hub *
              </label>
              <select
                value={pickupArea}
                onChange={(e) => setPickupArea(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {ELDORET_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Delivery Destination *
              </label>
              <select
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                {ELDORET_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Requirement & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Vehicle Type Required *
              </label>
              <select
                value={vehicleRequirement}
                onChange={(e) => setVehicleRequirement(e.target.value as VehicleRequirement)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              >
                <option value="canter_3ton">3-Tonne Isuzu Canter</option>
                <option value="pickup_truck">1-Tonne Pickup Truck</option>
                <option value="tipper_lorry">Heavy Tipper / Dump Lorry</option>
                <option value="tuk_tuk">Cargo Tuk-Tuk</option>
                <option value="flatbed">Flatbed Heavy Hauler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17324D] mb-1">
                Preferred Schedule Window
              </label>
              <input
                type="text"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                placeholder="e.g. Friday morning 08:00 AM"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#176B4D]"
              />
            </div>
          </div>

          {/* Handling Notes */}
          <div>
            <label className="block text-xs font-bold text-[#17324D] mb-1">
              Loading & Handling Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loading bay has forklift. Tarpaulin cover mandatory for paper."
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
              Broadcast Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Sparkles,
  Info,
  DollarSign,
  Flag,
  CheckCircle,
} from 'lucide-react';
import { Listing } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onMakeOffer: (listing: Listing) => void;
  onReportListing: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onMakeOffer,
  onReportListing,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [priceBenchmark, setPriceBenchmark] = useState<any | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState<boolean>(false);

  if (!listing) return null;

  const fetchPriceBenchmark = async () => {
    try {
      setLoadingBenchmark(true);
      const res = await fetch('/api/ai/price-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: listing.categoryName,
          subcategory: listing.subcategory,
          condition: listing.condition,
          quantity: listing.quantity,
          unit: listing.unit,
        }),
      });
      const data = await res.json();
      setPriceBenchmark(data);
    } catch (e) {
      console.error('Failed to fetch benchmark:', e);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  const conditionMap: Record<string, { label: string; desc: string; badge: string }> = {
    sorted_clean: {
      label: 'Sorted & Clean',
      desc: 'Free of oil, hazardous chemicals, or non-recyclable contaminants. Ready for mechanical processing.',
      badge: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20',
    },
    mixed_recyclable: {
      label: 'Mixed Recyclables',
      desc: 'Contains multiple compatible polymer or fiber grades. Secondary sorting required.',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    needs_cleaning: {
      label: 'Needs Cleaning / Washing',
      desc: 'Has dirt, food residue, or dust that requires a pre-wash or hot flaking line.',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    raw_industrial: {
      label: 'Raw Industrial / Agro Pulp',
      desc: 'High-moisture or raw organic waste. Direct processing or rapid transport required.',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  };

  const condInfo = conditionMap[listing.condition] || conditionMap.sorted_clean;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#17324D]/10">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B4D] bg-[#176B4D]/10 px-2 py-0.5 rounded">
              {listing.categoryName}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-medium text-gray-500">
              Listing ID: {listing.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#17324D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Photos Area */}
          <div>
            <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
              <img
                src={listing.photos[selectedImage] || listing.photos[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === idx ? 'border-[#176B4D]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Core Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${condInfo.badge}`}>
                {condInfo.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>{listing.approximateLocation.area}, {listing.approximateLocation.town}</span>
              </span>
              {listing.approximateLocation.landmark && (
                <span className="text-xs text-gray-400">
                  (Near {listing.approximateLocation.landmark})
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] font-heading leading-tight mb-3">
              {listing.title}
            </h1>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-[#F7F8F4] p-4 rounded-xl border border-[#17324D]/5">
              {listing.description}
            </p>
          </div>

          {/* Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-gray-400">Quantity</span>
              <p className="text-base font-extrabold text-[#17324D] mt-0.5">
                {listing.quantity.toLocaleString()} {listing.unit}
              </p>
              {listing.minQuantity && (
                <span className="text-[10px] text-gray-500">Min: {listing.minQuantity} {listing.unit}</span>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-gray-400">Pricing Mode</span>
              <p className="text-base font-extrabold text-[#176B4D] mt-0.5 capitalize">
                {listing.pricingMode.replace('_', ' ')}
              </p>
              {listing.askingPricePerUnit > 0 && (
                <span className="text-[10px] text-gray-500">
                  KES {listing.askingPricePerUnit.toLocaleString()} / {listing.unit}
                </span>
              )}
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-gray-400">Est. Total Value</span>
              <p className="text-base font-extrabold text-[#17324D] mt-0.5">
                {listing.askingPricePerUnit > 0
                  ? `KES ${(listing.quantity * listing.askingPricePerUnit).toLocaleString()}`
                  : 'By Negotiation'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-gray-400">Availability</span>
              <p className="text-xs font-semibold text-[#17324D] mt-1 line-clamp-2">
                {listing.availabilityDate}
              </p>
            </div>
          </div>

          {/* Contamination & Quality Notes */}
          {listing.contaminationNotes && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Condition & Quality Disclosure</span>
              </div>
              <p>{listing.contaminationNotes}</p>
              <p className="text-[10px] text-amber-700/80 mt-1">
                Note: Buyers are entitled to physical inspection at collection prior to final scale sign-off.
              </p>
            </div>
          )}

          {/* AI Market Price Benchmark Check */}
          <div className="p-4 rounded-xl border border-[#176B4D]/20 bg-[#176B4D]/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#176B4D]" />
                <span className="text-xs font-bold text-[#17324D]">
                  Eldoret Recycling Price Guidance
                </span>
              </div>
              {!priceBenchmark && (
                <button
                  onClick={fetchPriceBenchmark}
                  disabled={loadingBenchmark}
                  className="text-xs font-semibold px-2.5 py-1 bg-[#176B4D] text-white rounded-lg hover:bg-[#176B4D]/90 transition"
                >
                  {loadingBenchmark ? 'Checking benchmarks...' : 'Check Market Benchmark'}
                </button>
              )}
            </div>

            {priceBenchmark ? (
              <div className="space-y-1.5 text-xs text-[#17324D]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Indicative Median:</span>
                  <span className="font-bold text-[#176B4D] text-sm">
                    KES {priceBenchmark.priceRange.min} – {priceBenchmark.priceRange.max} / {listing.unit}
                  </span>
                  <span className="text-[11px] text-gray-500">({priceBenchmark.marketContext})</span>
                </div>
                <p className="text-[11px] text-gray-500 italic">
                  {priceBenchmark.disclaimer}
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-gray-500">
                Click to view recent transaction benchmarks for {listing.subcategory || listing.categoryName} in Uasin Gishu County.
              </p>
            )}
          </div>

          {/* Supplier Trust Card */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#17324D]">{listing.supplierName}</span>
                {listing.supplierVerified && (
                  <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#176B4D] bg-[#176B4D]/10 px-1.5 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Supplier
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Role: {listing.supplierRole} • Seller Rating: {listing.supplierRating.toFixed(1)}/5.0
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Approximate collection hub: {listing.approximateLocation.area}, Eldoret. Full exact GPS coordinates and phone contact released upon accepted transaction.
              </p>
            </div>

            <button
              onClick={() => onReportListing(listing)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 transition shrink-0"
            >
              <Flag className="w-3 h-3" />
              <span>Report Listing</span>
            </button>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 text-center sm:text-left">
              Transactions on TakaLink are backed by physical weighbridge verification.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onMakeOffer(listing);
                }}
                className="w-1/2 sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-xl shadow-md transition"
              >
                Submit Purchase Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

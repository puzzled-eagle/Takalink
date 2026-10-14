import React from 'react';
import { MapPin, ShieldCheck, Tag, Star, Eye } from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onViewDetails,
  onMakeOffer,
}) => {
  const conditionLabels: Record<string, { label: string; badgeClass: string }> = {
    sorted_clean: { label: 'Sorted & Clean', badgeClass: 'bg-[#176B4D]/10 text-[#176B4D] border-[#176B4D]/20' },
    mixed_recyclable: { label: 'Mixed Recyclable', badgeClass: 'bg-[#F7F8F4] text-[#17324D] border-[#E5E9ED]' },
    needs_cleaning: { label: 'Needs Cleaning', badgeClass: 'bg-[#F7F8F4] text-amber-800 border-[#E5E9ED]' },
    raw_industrial: { label: 'Raw Industrial', badgeClass: 'bg-[#F7F8F4] text-[#536575] border-[#E5E9ED]' },
  };

  const cond = conditionLabels[listing.condition] || conditionLabels.sorted_clean;

  return (
    <div className="bg-white rounded-xl border border-[#E5E9ED] shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group">
      {/* Image Area */}
      <div
        className="relative h-44 w-full bg-[#F7F8F4] overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(listing)}
      >
        <img
          src={
            listing.photos[0] ||
            'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
          }
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />

        {/* Category tag */}
        <div className="absolute top-2.5 left-2.5 bg-[#17324D]/90 backdrop-blur-sm text-[#F7F8F4] text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs">
          {listing.categoryName}
        </div>

        {/* Condition tag */}
        <div
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${cond.badgeClass}`}
        >
          {cond.label}
        </div>

        {/* Views counter overlay */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
          <Eye className="w-3 h-3" />
          <span>{listing.viewCount} views</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory & Location */}
          <div className="flex items-center justify-between text-xs text-[#536575] mb-1.5">
            <span className="font-semibold text-[#176B4D] truncate max-w-[55%]">
              {listing.subcategory || listing.categoryName}
            </span>
            <span className="flex items-center gap-1 truncate text-[#536575]">
              <MapPin className="w-3 h-3 shrink-0 text-[#536575]" />
              <span>{listing.approximateLocation.area}, {listing.approximateLocation.town}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(listing)}
            className="font-bold text-sm text-[#17324D] leading-snug line-clamp-2 hover:text-[#176B4D] transition cursor-pointer mb-2 font-heading"
          >
            {listing.title}
          </h3>

          {/* Supplier Info */}
          <div className="flex items-center gap-1.5 text-xs text-[#536575] mb-3 pb-2 border-b border-[#E5E9ED]">
            <span className="truncate max-w-[140px] font-medium text-[#17324D]">{listing.supplierName}</span>
            {listing.supplierVerified && (
              <span title="Verified Waste Supplier" className="inline-flex">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
              </span>
            )}
            <span className="text-[#E5E9ED]">•</span>
            <div className="flex items-center gap-0.5 text-amber-600 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{listing.supplierRating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#536575] tracking-wider">
                Available Volume
              </span>
              <p className="text-base font-extrabold text-[#17324D]">
                {listing.quantity.toLocaleString()} <span className="text-xs font-normal text-[#536575]">{listing.unit}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#536575] tracking-wider">
                {listing.pricingMode === 'request_offers' ? 'Pricing' : 'Asking Price'}
              </span>
              <p className="text-sm font-bold text-[#176B4D]">
                {listing.pricingMode === 'request_offers' ? (
                  <span className="text-xs text-[#536575] font-medium">Offers Invited</span>
                ) : (
                  <>
                    KES {listing.askingPricePerUnit.toLocaleString()}
                    <span className="text-[10px] font-normal text-[#536575]">/{listing.unit}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onViewDetails(listing)}
              className="w-full py-1.5 px-2 text-xs font-semibold text-[#17324D] bg-[#F7F8F4] hover:bg-[#E5E9ED] rounded-lg transition"
            >
              Details
            </button>
            <button
              onClick={() => onMakeOffer(listing)}
              className="w-full py-1.5 px-2 text-xs font-semibold text-white bg-[#176B4D] hover:bg-[#176B4D]/90 rounded-lg shadow-xs transition"
            >
              Make Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

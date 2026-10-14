import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  RotateCcw,
  PlusCircle,
  Tag,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { Listing, MaterialCategory } from '../types';
import { MATERIAL_CATEGORIES } from '../services/mockData';
import { useTakaStore } from '../services/store';
import { ListingCard } from '../components/ListingCard';

interface MarketplaceViewProps {
  onViewDetails: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
  onOpenCreateListing: () => void;
  onOpenAiAssistant: () => void;
}

const ELDORET_AREAS = [
  'All Areas',
  'West Indies',
  'Eldoret CBD',
  'Huruma',
  'Langas',
  'Pioneer',
  'Kapsoya',
  'Maili Nne',
  'Kimumu',
  'Annex',
  'Action',
  'Elgon View',
  'Turbo Industrial Corridor',
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onViewDetails,
  onMakeOffer,
  onOpenCreateListing,
  onOpenAiAssistant,
}) => {
  const { listings } = useTakaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'qty_desc'>('newest');

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => {
        if (l.status === 'draft' || l.status === 'removed' || l.status === 'expired') return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = l.title.toLowerCase().includes(q);
          const matchDesc = l.description.toLowerCase().includes(q);
          const matchCat = l.categoryName.toLowerCase().includes(q);
          const matchSub = l.subcategory.toLowerCase().includes(q);
          const matchLoc = l.approximateLocation.area.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchSub && !matchLoc) return false;
        }

        // Category
        if (selectedCategory !== 'all' && l.categoryId !== selectedCategory) {
          return false;
        }

        // Area
        if (selectedArea !== 'All Areas' && l.approximateLocation.area !== selectedArea) {
          return false;
        }

        // Condition
        if (selectedCondition !== 'all' && l.condition !== selectedCondition) {
          return false;
        }

        // Verified only
        if (verifiedOnly && !l.supplierVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price_asc') {
          return (a.askingPricePerUnit || 0) - (b.askingPricePerUnit || 0);
        }
        if (sortBy === 'price_desc') {
          return (b.askingPricePerUnit || 0) - (a.askingPricePerUnit || 0);
        }
        if (sortBy === 'qty_desc') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedArea, selectedCondition, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedArea('All Areas');
    setSelectedCondition('all');
    setVerifiedOnly(false);
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 py-6">
      {/* Top Banner / Search Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5E9ED] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] font-heading">
              Waste Marketplace
            </h1>
            <p className="text-xs text-[#536575]">
              Discover verified recyclable waste available for collection across Eldoret
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAiAssistant}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#176B4D]/10 text-[#176B4D] hover:bg-[#176B4D]/20 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#176B4D]" />
              <span>Ask AI Pricing</span>
            </button>

            <button
              onClick={onOpenCreateListing}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#176B4D] text-white hover:bg-[#176B4D]/90 shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Waste</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Primary Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#536575]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by material (PET, cardboard, copper, jerrycans, organic)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#E5E9ED] rounded-xl bg-[#F7F8F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D] focus:border-transparent transition text-[#17324D]"
            />
          </div>

          {/* Area Selector */}
          <div className="w-full md:w-52">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm border border-[#E5E9ED] rounded-xl bg-[#F7F8F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D] text-[#17324D]"
            >
              {ELDORET_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm border border-[#E5E9ED] rounded-xl bg-[#F7F8F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#176B4D] text-[#17324D]"
            >
              <option value="newest">Sort: Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="qty_desc">Volume: Largest First</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-[#17324D] text-white shadow-xs'
                : 'bg-[#F7F8F4] text-[#17324D] hover:bg-[#E5E9ED] border border-[#E5E9ED]'
            }`}
          >
            All Materials
          </button>
          {MATERIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full font-semibold shrink-0 transition ${
                selectedCategory === cat.id
                  ? 'bg-[#176B4D] text-white shadow-xs'
                  : 'bg-[#F7F8F4] text-[#536575] hover:bg-[#E5E9ED] border border-[#E5E9ED]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sub-filters (Condition, Verified only, Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E9ED] text-xs text-[#536575]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-[#536575]">Condition:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-2 py-1 border border-[#E5E9ED] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#176B4D] text-[#17324D]"
              >
                <option value="all">All Conditions</option>
                <option value="sorted_clean">Sorted & Clean</option>
                <option value="mixed_recyclable">Mixed Recyclable</option>
                <option value="needs_cleaning">Needs Cleaning</option>
                <option value="raw_industrial">Raw Industrial</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer font-medium select-none text-[#17324D]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-[#176B4D] rounded focus:ring-[#176B4D]"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>Verified Suppliers Only</span>
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#536575]">
              Showing <strong className="text-[#17324D]">{filteredListings.length}</strong> active batch{filteredListings.length === 1 ? '' : 'es'}
            </span>

            {(searchQuery || selectedCategory !== 'all' || selectedArea !== 'All Areas' || selectedCondition !== 'all' || verifiedOnly) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[#176B4D] hover:underline font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E9ED] p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#17324D]">No matching waste batches found</h3>
          <p className="text-xs text-[#536575] max-w-md mx-auto">
            No active listings match your current filters in Eldoret. Try clearing filters, expanding the geographic zone, or list your desired requirement in Bulk Pools.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#F7F8F4] text-[#17324D] text-xs font-semibold rounded-xl hover:bg-[#E5E9ED] transition"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenCreateListing}
              className="px-4 py-2 bg-[#176B4D] text-white text-xs font-bold rounded-xl hover:bg-[#176B4D]/90 transition"
            >
              Create New Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onViewDetails={onViewDetails}
              onMakeOffer={onMakeOffer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

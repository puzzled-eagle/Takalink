import React from 'react';
import {
  Recycle,
  Layers,
  Truck,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  MapPin,
  CheckCircle,
  Package,
  Users,
} from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../services/mockData';
import { useTakaStore } from '../services/store';

interface LandingPageViewProps {
  onSelectTab: (tab: string) => void;
  onOpenCreateListing: () => void;
  onOpenAiAssistant: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onSelectTab,
  onOpenCreateListing,
  onOpenAiAssistant,
}) => {
  const { theme } = useTakaStore();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 border transition-colors ${
          theme === 'light'
            ? 'bg-white text-[#17324D] border-[#E5E9ED] shadow-xs'
            : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20 shadow-md'
        }`}
      >
        <div className="max-w-3xl space-y-6 relative z-10">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              theme === 'light'
                ? 'bg-[#176B4D]/10 border border-[#176B4D]/30 text-[#176B4D]'
                : 'bg-[#176B4D]/30 border border-[#176B4D]/50 text-[#F7F8F4]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#176B4D] animate-pulse" />
            <span>Circular Economy Marketplace • Pilot Hub: Eldoret, Kenya</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
            Turning waste <br className="hidden sm:inline" />
            <span className="text-[#176B4D]">
              into measurable value.
            </span>
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed font-normal max-w-2xl ${
              theme === 'light' ? 'text-[#536575]' : 'text-[#F7F8F4]/80'
            }`}
          >
            TakaLink connects waste suppliers, recyclers, and licensed transporters across Eldoret.
            List reusable materials, pool small quantities into bulk industrial batches, and coordinate transparent collection with physical scale verification.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('marketplace')}
              className="px-6 py-3.5 rounded-xl bg-[#176B4D] text-white font-bold text-sm hover:bg-[#176B4D]/90 shadow-sm transition flex items-center gap-2"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCreateListing}
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm border transition flex items-center gap-2 ${
                theme === 'light'
                  ? 'bg-[#F7F8F4] hover:bg-[#E5E9ED] text-[#17324D] border-[#E5E9ED]'
                  : 'bg-white/10 hover:bg-white/20 text-[#F7F8F4] border-white/20'
              }`}
            >
              <Recycle className="w-4 h-4 text-[#176B4D]" />
              <span>List Your Waste</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className={`px-4 py-3.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                theme === 'light'
                  ? 'bg-[#176B4D]/10 hover:bg-[#176B4D]/20 text-[#176B4D]'
                  : 'bg-white/5 hover:bg-white/10 text-white/90'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#176B4D]" />
              <span className="hidden sm:inline">Ask AI Advisor</span>
            </button>
          </div>

          {/* Pilot Transparency Note */}
          <div
            className={`pt-4 border-t text-xs flex items-center gap-2 ${
              theme === 'light' ? 'border-[#E5E9ED] text-[#536575]' : 'border-white/10 text-white/70'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#176B4D] shrink-0" />
            <span>All transactions are negotiated directly and validated at verified weighbridges. Zero fabricated numbers.</span>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B4D]">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] font-heading">
            Three Practical Steps to Recovery
          </h2>
          <p className="text-xs sm:text-sm text-[#536575]">
            A transparent workflow designed for households, aggregators, and recycling facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E9ED] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center font-bold text-lg font-heading">
              01
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">1. List or Pool Material</h3>
            <p className="text-xs text-[#536575] leading-relaxed">
              Upload photos of your plastics, cardboard, metal, or organics. Use our AI Photo Assistant to categorize materials and verify contamination notes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E5E9ED] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#17324D]/10 text-[#17324D] flex items-center justify-center font-bold text-lg font-heading">
              02
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">2. Connect with Verified Buyers</h3>
            <p className="text-xs text-[#536575] leading-relaxed">
              Receive structured purchase offers in KES. Negotiate counteroffers or join bulk aggregation pools to sell smaller quantities together at industrial rates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E5E9ED] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center font-bold text-lg font-heading">
              03
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">3. Arrange Transparent Logistics</h3>
            <p className="text-xs text-[#536575] leading-relaxed">
              Book licensed Eldoret transporters (canters, pickups, tuk-tuks) with upfront freight quotes. Confirm delivery with official weighbridge receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Benefits Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B4D]">
            Value Chain Participants
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] font-heading">
            Built for Everyone in the Circular Economy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Supplier Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E9ED] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#176B4D]/10 text-[#176B4D] text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Waste Suppliers</span>
              </div>
              <h3 className="text-lg font-bold text-[#17324D]">Households, Shops & Aggregators</h3>
              <p className="text-xs text-[#536575] leading-relaxed">
                Find reliable buyers who want your sorted recyclables. Never get stuck with stockpiled cardboard or plastic bottles again.
              </p>
              <ul className="text-xs text-[#536575] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>AI assistance on sorting and contamination</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Pool small quantities to earn commercial rates</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Transparent payment negotiations in KES</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onSelectTab('marketplace')}
                className="w-full py-2 bg-[#F7F8F4] hover:bg-[#E5E9ED] text-[#17324D] text-xs font-bold rounded-xl border border-[#E5E9ED] transition"
              >
                Browse Listings
              </button>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E9ED] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#17324D]/10 text-[#17324D] text-xs font-bold">
                <Package className="w-3.5 h-3.5" />
                <span>Recyclers & Processors</span>
              </div>
              <h3 className="text-lg font-bold text-[#17324D]">Commercial Buyers & Mills</h3>
              <p className="text-xs text-[#536575] leading-relaxed">
                Source reliable, high-volume feedstock without informal middlemen markups. Set specific purity requirements and deadlines.
              </p>
              <ul className="text-xs text-[#536575] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Launch Bulk Procurement pools</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Direct counteroffers and negotiation audit trails</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Extended Producer Responsibility (EPR) tracking</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onSelectTab('bulk-requests')}
                className="w-full py-2 bg-[#F7F8F4] hover:bg-[#E5E9ED] text-[#17324D] text-xs font-bold rounded-xl border border-[#E5E9ED] transition"
              >
                View Bulk Pools
              </button>
            </div>
          </div>

          {/* Transporter Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E9ED] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#176B4D]/10 text-[#176B4D] text-xs font-bold">
                <Truck className="w-3.5 h-3.5" />
                <span>Cargo Haulers</span>
              </div>
              <h3 className="text-lg font-bold text-[#17324D]">Licensed Transporters</h3>
              <p className="text-xs text-[#536575] leading-relaxed">
                Monetize empty return trips or operate dedicated collection runs with pickups and canters across Uasin Gishu county.
              </p>
              <ul className="text-xs text-[#536575] space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Find open haulage jobs in Eldoret</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Submit competitive freight bids in KES</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>NEMA-compliant digital proof of delivery</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onSelectTab('logistics')}
                className="w-full py-2 bg-[#F7F8F4] hover:bg-[#E5E9ED] text-[#17324D] text-xs font-bold rounded-xl border border-[#E5E9ED] transition"
              >
                Check Haulage Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Material Categories Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#176B4D]">
              Recoverable Materials
            </span>
            <h2 className="text-2xl font-extrabold text-[#17324D] font-heading">
              Standard Categories in Eldoret
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('marketplace')}
            className="text-xs font-bold text-[#176B4D] hover:underline flex items-center gap-1"
          >
            <span>See all listings in Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MATERIAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectTab('marketplace')}
              className="p-4 bg-white rounded-xl border border-[#E5E9ED] hover:border-[#176B4D] shadow-xs cursor-pointer transition hover:shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#17324D] group-hover:text-[#176B4D] transition">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#536575] font-mono">
                  {cat.typicalMarketPriceRange.unit}
                </span>
              </div>
              <p className="text-[11px] text-[#536575] line-clamp-2 mb-2">
                {cat.description}
              </p>
              <div className="text-[11px] font-bold text-[#176B4D]">
                KES {cat.typicalMarketPriceRange.min} – {cat.typicalMarketPriceRange.max}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Eldoret Launch Hub Spotlight */}
      <section className="p-8 rounded-3xl bg-white border border-[#E5E9ED] shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B4D]/10 text-[#176B4D] text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Pilot Footprint: Uasin Gishu County</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17324D] font-heading leading-tight">
              Anchored in Eldoret, Designed to Scale Across Kenya
            </h3>
            <p className="text-xs sm:text-sm text-[#536575] leading-relaxed">
              Eldoret serves as the agricultural, retail, and manufacturing hub of the North Rift.
              TakaLink connects waste generators from wholesale produce markets, retail supermarkets, residential estates, and light industrial godowns directly with processors and recyclers.
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                West Indies
              </span>
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                Eldoret CBD Market
              </span>
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                Industrial Area
              </span>
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                Huruma & Langas
              </span>
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                Pioneer & Kapsoya
              </span>
              <span className="px-2.5 py-1 bg-[#F7F8F4] text-[#17324D] font-medium rounded-lg border border-[#E5E9ED]">
                Webuye / Turbo Road
              </span>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl space-y-4 border transition-colors ${
              theme === 'light'
                ? 'bg-[#F7F8F4] text-[#17324D] border-[#E5E9ED]'
                : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20'
            }`}
          >
            <h4 className={`font-bold text-sm flex items-center gap-2 ${theme === 'light' ? 'text-[#17324D]' : 'text-white'}`}>
              <Scale className="w-4 h-4 text-[#176B4D]" />
              <span>Responsible Waste Trading Commitments</span>
            </h4>
            <div className={`space-y-2.5 text-xs ${theme === 'light' ? 'text-[#536575]' : 'text-white/80'}`}>
              <p>
                <strong>Calibrated Scales:</strong> Transactions require physical scale slips. Neither buyer nor seller is forced to accept estimated numbers.
              </p>
              <p>
                <strong>Hazardous Material Restrictions:</strong> Unregistered hazardous industrial waste or uncontained chemicals are barred from the platform.
              </p>
              <p>
                <strong>Community Aggregation:</strong> Small suppliers pool compatible materials to bypass predatory middlemen.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('how-it-works')}
              className="text-xs font-bold text-[#176B4D] hover:underline inline-flex items-center gap-1"
            >
              <span>Read complete waste handling guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-[#176B4D] text-white space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
          Ready to turn waste into revenue?
        </h2>
        <p className="text-sm text-white/90 max-w-xl mx-auto">
          Join Eldoret recyclers, commercial buyers, and community aggregators building Kenya's transparent circular economy.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={onOpenCreateListing}
            className="px-6 py-3 bg-white text-[#176B4D] font-bold text-sm rounded-xl shadow-xs hover:bg-[#F7F8F4] transition"
          >
            List Waste for Free
          </button>
          <button
            onClick={() => onSelectTab('marketplace')}
            className="px-6 py-3 bg-[#17324D] text-white font-semibold text-sm rounded-xl hover:bg-[#17324D]/90 transition"
          >
            Browse Listings
          </button>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import {
  Recycle,
  CheckCircle,
  Scale,
  ShieldCheck,
  Truck,
  Layers,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { MATERIAL_CATEGORIES } from '../services/mockData';
import { useTakaStore } from '../services/store';

export const HowItWorksView: React.FC = () => {
  const { theme } = useTakaStore();

  return (
    <div className="space-y-8 py-6">
      {/* Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-10 border shadow-sm space-y-3 transition-colors ${
          theme === 'light'
            ? 'bg-white text-[#17324D] border-gray-200'
            : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#176B4D]">
          Operational Guidelines
        </span>
        <h1 className={`text-2xl sm:text-4xl font-extrabold font-heading ${theme === 'light' ? 'text-[#17324D]' : 'text-white'}`}>
          Circular Economy Guide for Eldoret
        </h1>
        <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
          How TakaLink connects community waste suppliers, commercial re-processors, and licensed transporters to divert waste from landfills and maximize economic recovery.
        </p>
      </div>

      {/* Guide Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#17324D]">1. Physical Scale Verification</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            All marketplace trades conclude based on official weighbridge or calibrated platform scale readings in Eldoret. Counterparties confirm the net weight ticket before final sign-off.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#17324D]/10 text-[#17324D] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#17324D]">2. Bulk Aggregation Principle</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Small suppliers with 50 kg – 500 kg batches can pledge their quantities into open buyer procurement pools. This eliminates predatory middlemen and gives informal collectors fair factory-gate pricing.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#176B4D]/10 text-[#176B4D] flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#17324D]">3. NEMA-Compliant Logistics</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Transporters must operate covered, spill-contained vehicles (e.g. Isuzu canters with heavy-duty tarpaulins) in compliance with Kenya's Sustainable Waste Management Act 2022.
          </p>
        </div>
      </div>

      {/* Material Grading Benchmarks Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#17324D] font-heading">
            Eldoret Material Handling & Typical Price Range (KES)
          </h3>
          <p className="text-xs text-gray-500">
            Indicative market benchmark as observed across Eldoret scrap yards and re-processors (Q4 2026)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F4] text-[#17324D] font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Standard Subtypes</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Benchmark Range</th>
                <th className="p-3">Handling Restrictions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MATERIAL_CATEGORIES.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-[#17324D]">{cat.name}</td>
                  <td className="p-3 text-gray-600">{cat.commonSubtypes.join(', ')}</td>
                  <td className="p-3 font-mono text-gray-500">{cat.unitDefault}</td>
                  <td className="p-3 font-bold text-[#176B4D]">
                    KES {cat.typicalMarketPriceRange.min} – {cat.typicalMarketPriceRange.max}
                  </td>
                  <td className="p-3 text-gray-500 text-[11px]">{cat.handlingRestrictions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-bold text-[#17324D] font-heading">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs text-gray-700">
          <div className="p-3 bg-[#F7F8F4] rounded-xl space-y-1">
            <h4 className="font-bold text-[#17324D]">Does TakaLink take a cut of the transaction?</h4>
            <p className="text-gray-600">
              During the pilot phase in Eldoret, listing, discovery, and bilateral negotiations are completely free. When automated payments are introduced, transparent platform fees will be published before any commitment.
            </p>
          </div>

          <div className="p-3 bg-[#F7F8F4] rounded-xl space-y-1">
            <h4 className="font-bold text-[#17324D]">How do I verify the quality of waste before payment?</h4>
            <p className="text-gray-600">
              Both supplier and buyer must agree on physical inspection at pickup. Contamination clauses allow buyers to renegotiate unit rates if moisture, mud, or non-recyclable items exceed stated thresholds.
            </p>
          </div>

          <div className="p-3 bg-[#F7F8F4] rounded-xl space-y-1">
            <h4 className="font-bold text-[#17324D]">Can I trade electronic waste (E-Waste)?</h4>
            <p className="text-gray-600">
              E-waste is categorized as hazardous under Kenyan law. Only licensed e-waste aggregators and handlers with valid NEMA permits may execute collection and dismantling on TakaLink.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

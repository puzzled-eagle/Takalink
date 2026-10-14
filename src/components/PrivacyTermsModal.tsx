import React from 'react';
import { X, ShieldCheck, Scale, FileText } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-[#17324D]/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#176B4D]" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Compliance, Privacy & Platform Terms
              </h3>
              <p className="text-xs text-white/70">
                Operating under Kenya Regulatory Frameworks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-gray-700 leading-relaxed">
          <div className="p-3 bg-[#176B4D]/10 rounded-xl border border-[#176B4D]/20 text-[#17324D]">
            <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5 text-[#176B4D]">
              <ShieldCheck className="w-4 h-4" />
              <span>Pilot Boundary Notice</span>
            </h4>
            <p>
              TakaLink is currently deployed in demonstration and pilot phase in Eldoret, Uasin Gishu County. All transactions require mutual verification of physical volume and grade prior to release.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#17324D] mb-1.5">
              1. Kenya Data Protection Act, 2019 Compliance
            </h4>
            <p className="mb-1">
              TakaLink collects only the minimum personal data necessary for facilitating waste marketplace discovery and logistics:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                <strong>Approximate Locations:</strong> Public listings reveal only generalized zones (e.g., West Indies, Huruma, CBD). Exact pickup gates, phone numbers, and coordinates are revealed strictly to confirmed counterparties.
              </li>
              <li>
                <strong>Data Minimization & Retention:</strong> User accounts can request complete data export or deactivation through the compliance desk.
              </li>
              <li>
                <strong>No Unauthorized AI Processing:</strong> Sensitive personal identity documents are never processed through third-party training pipelines.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#17324D] mb-1.5">
              2. Sustainable Waste Management Act, 2022 & NEMA Standards
            </h4>
            <p className="mb-1">
              Every marketplace participant must adhere to Kenyan national waste standards:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                <strong>Hazardous Waste Ban:</strong> Unregistered hazardous industrial waste, untreated hospital bio-waste, and uncontained toxic chemicals are strictly prohibited.
              </li>
              <li>
                <strong>Licensed Transporters:</strong> High-volume commercial haulage must be performed by NEMA-permitted waste transporters equipped with leakproof containment.
              </li>
              <li>
                <strong>Extended Producer Responsibility (EPR):</strong> Recyclers and buyers can obtain aggregated material batch certificates for PRO (Producer Responsibility Organization) compliance reporting.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#17324D] mb-1.5">
              3. Transparent Marketplace & Anti-Fraud Policy
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                <strong>Offer Acceptance:</strong> An accepted offer indicates commercial agreement on price per unit and pickup schedule; it does not constitute payment transfer.
              </li>
              <li>
                <strong>Scale Verification:</strong> Final payments are settled based on actual verified net weights recorded on calibrated scales or official municipal weighbridges in Eldoret.
              </li>
              <li>
                <strong>Zero Tolerance for Counterfeit Quality:</strong> Listing contaminated waste as "Clean Sorted" will result in account suspension after administrative review.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#17324D]/90 rounded-xl transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Recycle, ShieldCheck, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { useTakaStore } from '../services/store';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenPrivacyTerms: () => void;
  onOpenSchemaViewer: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenPrivacyTerms,
  onOpenSchemaViewer,
}) => {
  const { theme } = useTakaStore();

  return (
    <footer
      className={`pt-12 pb-8 border-t transition-colors ${
        theme === 'light'
          ? 'bg-white text-[#17324D] border-gray-200'
          : 'bg-[#17324D] text-[#F7F8F4] border-[#17324D]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#176B4D] flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className={`text-xl font-bold tracking-tight font-heading ${theme === 'light' ? 'text-[#17324D]' : 'text-white'}`}>
                Taka<span className="text-[#176B4D]">Link</span>
              </span>
            </div>
            <p className={`text-sm font-medium mb-4 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
              Turning waste into value. Connecting suppliers, recyclers, and transporters to build an inclusive circular economy.
            </p>
            <div className={`flex items-center gap-2 text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/70'}`}>
              <MapPin className="w-3.5 h-3.5 text-[#176B4D]" />
              <span>Initial Hub: Eldoret, Uasin Gishu County, Kenya</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-[#17324D]' : 'text-white/60'}`}>
              Platform
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
              <li>
                <button
                  onClick={() => onSelectTab('marketplace')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Browse Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('bulk-requests')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Bulk Aggregation Pools
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('logistics')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Transporter Job Board
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('offers')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Offer Negotiations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Role Dashboards
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-[#17324D]' : 'text-white/60'}`}>
              Compliance & Safety
            </h4>
            <ul className={`space-y-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
              <li>
                <button
                  onClick={() => onSelectTab('how-it-works')}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Waste Handling Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyTerms}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Data Protection Act 2019
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyTerms}
                  className={`hover:text-[#176B4D] transition ${theme === 'light' ? 'hover:text-[#176B4D]' : 'hover:text-white'}`}
                >
                  Sustainable Waste Mgmt 2022
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSchemaViewer}
                  className="hover:underline transition flex items-center gap-1 text-[#176B4D] font-semibold"
                >
                  <span>PostgreSQL / Supabase Schema</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Eldoret Local Helpdesk */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-[#17324D]' : 'text-white/60'}`}>
              Eldoret Desk
            </h4>
            <div className={`space-y-2.5 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>+254 700 000 000 (Desk)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#176B4D]" />
                <span>support@takalink.co.ke</span>
              </p>
              <div className={`mt-3 p-2.5 rounded text-[11px] border ${
                theme === 'light'
                  ? 'bg-[#F7F8F4] border-gray-200 text-gray-700'
                  : 'bg-white/5 border-white/10 text-white/70'
              }`}>
                <div className={`flex items-center gap-1.5 font-semibold mb-1 ${theme === 'light' ? 'text-[#17324D]' : 'text-white'}`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#176B4D]" />
                  <span>Verified Counterparties</span>
                </div>
                Transparent physical weighing and collection verification required before transaction completion.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          theme === 'light' ? 'border-gray-200 text-gray-500' : 'border-white/10 text-white/60'
        }`}>
          <p>© {new Date().getFullYear()} TakaLink. Turning waste into value. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenPrivacyTerms} className={`transition ${theme === 'light' ? 'hover:text-[#17324D]' : 'hover:text-white'}`}>
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onOpenPrivacyTerms} className={`transition ${theme === 'light' ? 'hover:text-[#17324D]' : 'hover:text-white'}`}>
              Terms of Service
            </button>
            <span>•</span>
            <span>Uasin Gishu County, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { X, Copy, Check, Database, ExternalLink } from 'lucide-react';

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCHEMA_SQL = `-- TAKALINK PLATFORM: PRODUCTION POSTGRESQL / SUPABASE SCHEMA
-- Launch Focus: Eldoret, Uasin Gishu County, Kenya
-- Architecture: Row Level Security (RLS), RBAC, Circular Economy Workflow

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES & ROLES
CREATE TYPE user_role_enum AS ENUM ('supplier', 'buyer', 'transporter', 'admin');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone_number TEXT,
    county TEXT DEFAULT 'Uasin Gishu',
    town TEXT DEFAULT 'Eldoret',
    area TEXT NOT NULL, -- West Indies, Huruma, Langas, Pioneer, Kapsoya, CBD
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    nema_permit_number TEXT,
    bio TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MATERIAL CATEGORIES & LISTINGS
CREATE TABLE public.material_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    unit_default TEXT DEFAULT 'kg',
    min_market_price_kes NUMERIC(10, 2),
    max_market_price_kes NUMERIC(10, 2),
    is_hazardous BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID NOT NULL REFERENCES public.material_categories(id),
    subcategory TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    condition TEXT NOT NULL, -- 'sorted_clean', 'mixed_recyclable', 'needs_cleaning', 'raw_industrial'
    contamination_notes TEXT,
    pricing_mode TEXT NOT NULL DEFAULT 'negotiable',
    asking_price_per_unit NUMERIC(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'KES',
    town TEXT DEFAULT 'Eldoret',
    area TEXT NOT NULL,
    availability_date TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'reserved', 'sold', 'expired')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BULK AGGREGATION & CONTRIBUTIONS
CREATE TABLE public.bulk_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    category_id UUID NOT NULL REFERENCES public.material_categories(id),
    title TEXT NOT NULL,
    target_quantity NUMERIC(12, 2) NOT NULL,
    current_aggregated_quantity NUMERIC(12, 2) DEFAULT 0,
    unit TEXT NOT NULL,
    target_price_per_unit NUMERIC(12, 2) NOT NULL,
    location_area TEXT NOT NULL,
    deadline DATE NOT NULL,
    status TEXT DEFAULT 'open'
);

CREATE TABLE public.aggregation_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bulk_request_id UUID NOT NULL REFERENCES public.bulk_requests(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id),
    supplier_id UUID NOT NULL REFERENCES public.profiles(id),
    proposed_quantity NUMERIC(12, 2) NOT NULL,
    agreed_price_per_unit NUMERIC(12, 2) NOT NULL,
    status TEXT DEFAULT 'pending'
);

-- 4. OFFERS, NEGOTIATIONS & HISTORY
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id),
    supplier_id UUID NOT NULL REFERENCES public.profiles(id),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    quantity NUMERIC(12, 2) NOT NULL,
    unit TEXT NOT NULL,
    price_per_unit NUMERIC(12, 2) NOT NULL,
    total_estimated_value NUMERIC(14, 2) NOT NULL,
    status TEXT DEFAULT 'offer_submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRANSPORT JOBS & QUOTES
CREATE TABLE public.transport_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id),
    material_name TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    unit TEXT NOT NULL,
    pickup_area TEXT NOT NULL,
    delivery_area TEXT NOT NULL,
    vehicle_requirement TEXT NOT NULL,
    assigned_transporter_id UUID REFERENCES public.profiles(id),
    agreed_fee NUMERIC(12, 2),
    status TEXT DEFAULT 'open_for_quotes'
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active listings" ON public.listings FOR SELECT USING (status != 'draft');
CREATE POLICY "Suppliers manage own listings" ON public.listings FOR ALL USING (auth.uid() = supplier_id);
CREATE POLICY "Offers visible to counterparty only" ON public.offers FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);`;

export const SchemaViewerModal: React.FC<SchemaViewerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-[#17324D]/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#17324D] text-[#F7F8F4] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#176B4D]" />
            <div>
              <h3 className="text-base font-bold font-heading">
                PostgreSQL & Supabase DDL Schema
              </h3>
              <p className="text-xs text-white/70">
                Ready for deployment with RLS, foreign keys, and Eldoret marketplace models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#176B4D] hover:bg-[#176B4D]/90 text-white text-xs font-semibold rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SQL Content */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed selection:bg-[#176B4D]">
          <pre>{SCHEMA_SQL}</pre>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between shrink-0">
          <span>Target Platform: PostgreSQL 15+ / Supabase / Cloud SQL</span>
          <span className="text-[11px] text-gray-400">File location: src/database/schema.sql</span>
        </div>
      </div>
    </div>
  );
};

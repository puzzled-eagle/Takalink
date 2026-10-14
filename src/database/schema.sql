-- ============================================================================
-- TAKALINK PLATFORM: PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Launch Focus: Eldoret, Kenya
-- Architecture: Row Level Security (RLS), RBAC, Circular Economy Workflow
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone_number TEXT,
    county TEXT DEFAULT 'Uasin Gishu',
    town TEXT DEFAULT 'Eldoret',
    area TEXT NOT NULL, -- e.g., West Indies, Huruma, Langas, Pioneer, Kapsoya, CBD
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    nema_permit_number TEXT,
    bio TEXT,
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TYPE user_role_enum AS ENUM ('supplier', 'buyer', 'transporter', 'admin');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_enum NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 3. MATERIAL CATEGORIES
CREATE TABLE IF NOT EXISTS public.material_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    unit_default TEXT NOT NULL DEFAULT 'kg',
    min_market_price_kes NUMERIC(10, 2),
    max_market_price_kes NUMERIC(10, 2),
    handling_restrictions TEXT,
    is_hazardous BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LISTINGS
CREATE TYPE material_condition_enum AS ENUM ('sorted_clean', 'mixed_recyclable', 'needs_cleaning', 'raw_industrial');
CREATE TYPE pricing_mode_enum AS ENUM ('fixed', 'negotiable', 'request_offers');
CREATE TYPE listing_status_enum AS ENUM ('draft', 'active', 'reserved', 'sold', 'expired', 'removed');

CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.material_categories(id) ON DELETE RESTRICT,
    subcategory TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'kg',
    condition material_condition_enum NOT NULL DEFAULT 'sorted_clean',
    contamination_notes TEXT,
    pricing_mode pricing_mode_enum NOT NULL DEFAULT 'negotiable',
    asking_price_per_unit NUMERIC(12, 2) DEFAULT 0 CHECK (asking_price_per_unit >= 0),
    currency TEXT NOT NULL DEFAULT 'KES',
    town TEXT NOT NULL DEFAULT 'Eldoret',
    area TEXT NOT NULL,
    landmark TEXT,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    availability_date TEXT,
    min_quantity NUMERIC(12, 2) DEFAULT 1,
    status listing_status_enum NOT NULL DEFAULT 'active',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LISTING IMAGES
CREATE TABLE IF NOT EXISTS public.listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BUYER REQUIREMENTS & BULK PROCUREMENT REQUESTS
CREATE TYPE bulk_request_status_enum AS ENUM ('open', 'partially_matched', 'target_reached', 'confirmed', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.bulk_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.material_categories(id) ON DELETE RESTRICT,
    subcategory TEXT,
    title TEXT NOT NULL,
    target_quantity NUMERIC(12, 2) NOT NULL CHECK (target_quantity > 0),
    current_aggregated_quantity NUMERIC(12, 2) DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'kg',
    quality_requirements TEXT,
    max_contamination_acceptable TEXT,
    target_price_per_unit NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'KES',
    location_area TEXT NOT NULL,
    deadline DATE NOT NULL,
    status bulk_request_status_enum NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AGGREGATION CONTRIBUTIONS
CREATE TYPE contribution_status_enum AS ENUM ('pending', 'approved', 'rejected', 'collected');

CREATE TABLE IF NOT EXISTS public.aggregation_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bulk_request_id UUID NOT NULL REFERENCES public.bulk_requests(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    proposed_quantity NUMERIC(12, 2) NOT NULL CHECK (proposed_quantity > 0),
    agreed_price_per_unit NUMERIC(12, 2) NOT NULL,
    status contribution_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. OFFERS & NEGOTIATIONS
CREATE TYPE offer_status_enum AS ENUM (
    'inquiry', 'offer_submitted', 'counteroffer', 'accepted', 
    'rejected', 'awaiting_collection', 'collection_scheduled', 
    'picked_up', 'delivered', 'completed', 'cancelled', 'disputed'
);

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    supplier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    quantity NUMERIC(12, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    price_per_unit NUMERIC(12, 2) NOT NULL CHECK (price_per_unit > 0),
    total_estimated_value NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'KES',
    proposed_collection_date DATE,
    notes TEXT,
    counter_price_per_unit NUMERIC(12, 2),
    counter_notes TEXT,
    status offer_status_enum NOT NULL DEFAULT 'offer_submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TRANSACTION EVENTS / AUDIT LOG
CREATE TABLE IF NOT EXISTS public.offer_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    action TEXT NOT NULL,
    note TEXT,
    price_per_unit NUMERIC(12, 2),
    quantity NUMERIC(12, 2),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TRANSPORT JOBS & LOGISTICS
CREATE TYPE vehicle_type_enum AS ENUM ('motorcycle_cargo', 'tuk_tuk', 'pickup_truck', 'canter_3ton', 'tipper_lorry', 'flatbed');
CREATE TYPE transport_job_status_enum AS ENUM ('open_for_quotes', 'assigned', 'in_transit', 'delivered', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.transport_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    material_name TEXT NOT NULL,
    quantity NUMERIC(12, 2) NOT NULL,
    unit TEXT NOT NULL,
    pickup_area TEXT NOT NULL,
    delivery_area TEXT NOT NULL,
    pickup_address_approx TEXT NOT NULL,
    delivery_address_approx TEXT NOT NULL,
    vehicle_requirement vehicle_type_enum NOT NULL DEFAULT 'pickup_truck',
    preferred_date TIMESTAMPTZ NOT NULL,
    notes TEXT,
    assigned_transporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    agreed_fee NUMERIC(12, 2),
    status transport_job_status_enum NOT NULL DEFAULT 'open_for_quotes',
    pickup_proof_note TEXT,
    delivery_proof_note TEXT,
    pickup_timestamp TIMESTAMPTZ,
    delivery_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TRANSPORT QUOTES
CREATE TABLE IF NOT EXISTS public.transport_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.transport_jobs(id) ON DELETE CASCADE,
    transporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    vehicle_type vehicle_type_enum NOT NULL,
    quote_amount NUMERIC(12, 2) NOT NULL CHECK (quote_amount > 0),
    currency TEXT NOT NULL DEFAULT 'KES',
    estimated_hours NUMERIC(4, 1),
    availability_notes TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT NOT NULL,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    material_category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SAFETY REPORTS & MODERATION
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user')),
    target_id TEXT NOT NULL,
    target_title TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    link_target TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Public profiles can be viewed by all authenticated users"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can edit own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Active listings readable by all; only owners can mutate
CREATE POLICY "Active listings are viewable by everyone"
ON public.listings FOR SELECT USING (status != 'draft' OR supplier_id = auth.uid());

CREATE POLICY "Suppliers can create listings"
ON public.listings FOR INSERT WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update own listings"
ON public.listings FOR UPDATE USING (auth.uid() = supplier_id);

-- Offers: Only buyer, supplier, and admin can view negotiation details
CREATE POLICY "Offer participants can view offer"
ON public.offers FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = supplier_id OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Buyers can submit offers"
ON public.offers FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update offers according to workflow"
ON public.offers FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- Notifications: Only recipient can view/update
CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Techizatcin.com — Supabase Cədvəllər
-- Supabase Dashboard → SQL Editor → New Query → Yapışdır → Run
-- ============================================================


-- ============================================================
-- 1. SUPPLIER_PROFILES (Təchizatçı profilləri)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.supplier_profiles (
  id              UUID PRIMARY KEY,              -- auth.users.id ilə eynidir
  user_id         UUID NOT NULL,
  company_name    TEXT NOT NULL DEFAULT '',
  contact_person  TEXT NOT NULL DEFAULT '',
  email           TEXT NOT NULL DEFAULT '',
  phone           TEXT NOT NULL DEFAULT '',
  activity_area   TEXT NOT NULL DEFAULT '',
  city            TEXT NOT NULL DEFAULT '',
  address         TEXT,
  about           TEXT,
  working_hours   TEXT,
  logo_url        TEXT,
  cover_url       TEXT,
  map_link        TEXT,
  whatsapp_number TEXT,
  whatsapp_link   TEXT,
  rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  product_count   INTEGER NOT NULL DEFAULT 0,
  approval_status TEXT NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 2. RESTAURANT_PROFILES (Restoran profilləri)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.restaurant_profiles (
  id               UUID PRIMARY KEY,
  user_id          UUID NOT NULL,
  restaurant_name  TEXT NOT NULL DEFAULT '',
  contact_person   TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL DEFAULT '',
  phone            TEXT NOT NULL DEFAULT '',
  city             TEXT NOT NULL DEFAULT '',
  address          TEXT,
  about            TEXT,
  whatsapp_number  TEXT,
  logo_url         TEXT,
  cover_url        TEXT,
  approval_status  TEXT NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. PRODUCT_LISTINGS (Məhsul elanları)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_listings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id           UUID NOT NULL,
  supplier_name         TEXT NOT NULL DEFAULT '',
  supplier_logo_url     TEXT,
  product_name          TEXT NOT NULL DEFAULT '',
  category_id           TEXT NOT NULL DEFAULT '',
  category_name         TEXT NOT NULL DEFAULT '',
  subcategory_id        TEXT,
  description           TEXT,
  price                 NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_unit            TEXT NOT NULL DEFAULT 'Kq',
  min_order_qty         NUMERIC(10,2) NOT NULL DEFAULT 1,
  negotiable            BOOLEAN NOT NULL DEFAULT FALSE,
  stock_qty             INTEGER NOT NULL DEFAULT 0,
  stock_status          TEXT NOT NULL DEFAULT 'in_stock',
  delivery_regions      TEXT[] NOT NULL DEFAULT '{}',
  delivery_time         TEXT,
  delivery_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_delivery         BOOLEAN NOT NULL DEFAULT FALSE,
  contact_person        TEXT,
  contact_phone         TEXT,
  contact_whatsapp      TEXT,
  contact_whatsapp_link TEXT,
  contact_email         TEXT,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  approval_status       TEXT NOT NULL DEFAULT 'pending',
  view_count            INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 4. İNDEKSLƏR (axtarış sürəti üçün)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_user_id    ON public.supplier_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_user_id  ON public.restaurant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_supplier_id ON public.product_listings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_category    ON public.product_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_product_listings_approval    ON public.product_listings(approval_status);
CREATE INDEX IF NOT EXISTS idx_product_listings_created_at  ON public.product_listings(created_at DESC);


-- ============================================================
-- 5. ROW LEVEL SECURITY — Hər istifadəçi yalnız öz datasını dəyişə bilər
-- ============================================================

ALTER TABLE public.supplier_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_listings    ENABLE ROW LEVEL SECURITY;

-- Supplier profiles
CREATE POLICY "sp_select" ON public.supplier_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "sp_insert" ON public.supplier_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "sp_update" ON public.supplier_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Restaurant profiles
CREATE POLICY "rp_select" ON public.restaurant_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "rp_insert" ON public.restaurant_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "rp_update" ON public.restaurant_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Product listings
CREATE POLICY "pl_select" ON public.product_listings
  FOR SELECT USING (TRUE);

CREATE POLICY "pl_insert" ON public.product_listings
  FOR INSERT WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "pl_update" ON public.product_listings
  FOR UPDATE USING (auth.uid() = supplier_id);

CREATE POLICY "pl_delete" ON public.product_listings
  FOR DELETE USING (auth.uid() = supplier_id);


-- ============================================================
-- 6. UPDATED_AT avtomatik yenilənməsi
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER supplier_profiles_updated_at
  BEFORE UPDATE ON public.supplier_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER restaurant_profiles_updated_at
  BEFORE UPDATE ON public.restaurant_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER product_listings_updated_at
  BEFORE UPDATE ON public.product_listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

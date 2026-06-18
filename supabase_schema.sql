-- ============================================================
-- supplier_profiles cədvəli — tam schema
-- Supabase SQL Editor-da işə salın
-- ============================================================

-- Cədvəli yarat (əgər yoxdursa)
CREATE TABLE IF NOT EXISTS supplier_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  -- Şirkət məlumatları
  "companyName" TEXT NOT NULL,
  "voen" TEXT,
  "category" TEXT,
  "city" TEXT,
  "region" TEXT,
  "address" TEXT,
  "about" TEXT,

  -- Əlaqə
  "contactPerson" TEXT,
  "phone" TEXT,
  "whatsapp" TEXT,
  "whatsappLink" TEXT,
  "email" TEXT,

  -- Vizual
  "logoUrl" TEXT,
  "coverUrl" TEXT,
  "documentUrls" TEXT[] DEFAULT '{}',

  -- Sosial
  "websiteUrl" TEXT,
  "instagramUrl" TEXT,
  "facebookUrl" TEXT,
  "linkedinUrl" TEXT,
  "mapLink" TEXT,
  "workingHours" TEXT,

  -- Status
  "rating" NUMERIC DEFAULT 0,
  "reviewCount" INTEGER DEFAULT 0,
  "productCount" INTEGER DEFAULT 0,
  "approvalStatus" TEXT DEFAULT 'pending',
  "isActive" BOOLEAN DEFAULT true,
  "isPublic" BOOLEAN DEFAULT false,

  -- Vaxt
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndekslər
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_userId ON supplier_profiles("userId");
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_category ON supplier_profiles("category");
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_city ON supplier_profiles("city");
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_isPublic ON supplier_profiles("isPublic");
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_approval ON supplier_profiles("approvalStatus");

-- RLS (Row Level Security) — hər kəs public profilləri görə bilər
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;

-- Public oxuma siyasəti
CREATE POLICY "Public profillər açıqdır"
  ON supplier_profiles FOR SELECT
  USING ("isPublic" = true AND "isActive" = true);

-- Təchizatçı öz profilini idarə edə bilər
CREATE POLICY "Təchizatçı öz profilini yarada bilər"
  ON supplier_profiles FOR INSERT
  WITH CHECK (auth.uid() = "userId");

CREATE POLICY "Təchizatçı öz profilini yeniləyə bilər"
  ON supplier_profiles FOR UPDATE
  USING (auth.uid() = "userId")
  WITH CHECK (auth.uid() = "userId");

-- Admin bütün profilləri idarə edə bilər
CREATE POLICY "Admin tam idarə"
  ON supplier_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Storage bucket-lər (şəkillər üçün)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS — avatars
CREATE POLICY "Avatars açıqdır"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "İstifadəçi avatar yükləyə bilər"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "İstifadəçi avatarını silə bilər"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- Storage RLS — documents
CREATE POLICY "Sənəd sahibi görə bilər"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "İstifadəçi sənəd yükləyə bilər"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

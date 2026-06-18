-- ============================================================
-- Əgər supplier_profiles cədvəli varsa amma sütunlar əksikdirsə
-- bunu Supabase SQL Editor-da işə salın
-- ============================================================

-- Əskik sütunları əlavə et
DO $$
BEGIN
  -- Şirkət məlumatları
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'companyName') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "companyName" TEXT DEFAULT 'Şirkət';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'voen') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "voen" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'category') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "category" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'city') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "city" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'region') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "region" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'address') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "address" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'about') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "about" TEXT;
  END IF;

  -- Əlaqə
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'contactPerson') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "contactPerson" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'phone') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "phone" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'whatsapp') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "whatsapp" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'whatsappLink') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "whatsappLink" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'email') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "email" TEXT;
  END IF;

  -- Vizual
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'logoUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "logoUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'coverUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "coverUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'documentUrls') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "documentUrls" TEXT[] DEFAULT '{}';
  END IF;

  -- Sosial
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'websiteUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "websiteUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'instagramUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "instagramUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'facebookUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "facebookUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'linkedinUrl') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "linkedinUrl" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'mapLink') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "mapLink" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'workingHours') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "workingHours" TEXT;
  END IF;

  -- Status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'rating') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "rating" NUMERIC DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'reviewCount') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "reviewCount" INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'productCount') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "productCount" INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'approvalStatus') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "approvalStatus" TEXT DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'isActive') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "isActive" BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'isPublic') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "isPublic" BOOLEAN DEFAULT false;
  END IF;

  -- userId (əgər yoxdursa)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'supplier_profiles' AND column_name = 'userId') THEN
    ALTER TABLE supplier_profiles ADD COLUMN "userId" UUID REFERENCES auth.users(id);
  END IF;
END $$;

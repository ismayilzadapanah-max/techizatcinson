-- ============================================================
-- BUNU SUPABASE SQL EDITOR-DA İŞƏ SALIN (bir dəfəlik)
-- ============================================================

-- 1. supplier_profiles-a əksik sütunları əlavə et
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS voen TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS contact_person TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS whatsapp_link TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS document_urls TEXT[] DEFAULT '{}';
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS map_link TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS working_hours TEXT;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE supplier_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Storage bucket-lər
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;

-- 3. Avatars public oxuna bilər
DROP POLICY IF EXISTS "Avatars acıqdır" ON storage.objects;
CREATE POLICY "Avatars acıqdır" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar yukle" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- 4. RLS - public profillər
ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public gor" ON supplier_profiles;
CREATE POLICY "Public gor" ON supplier_profiles FOR SELECT USING (is_public = true AND is_active = true);
DROP POLICY IF EXISTS "Ozu yarada bilir" ON supplier_profiles;
CREATE POLICY "Ozu yarada bilir" ON supplier_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Ozu duzelde bilir" ON supplier_profiles;
CREATE POLICY "Ozu duzelde bilir" ON supplier_profiles FOR UPDATE USING (auth.uid() = user_id);

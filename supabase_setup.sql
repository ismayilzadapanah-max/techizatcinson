-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'supplier', 'restaurant')) NOT NULL DEFAULT 'supplier',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Supplier Profiles table
CREATE TABLE IF NOT EXISTS public.supplier_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_link TEXT,
  city TEXT,
  activity_area TEXT,
  about TEXT,
  logo_url TEXT,
  cover_url TEXT,
  map_link TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Restaurant Profiles table
CREATE TABLE IF NOT EXISTS public.restaurant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_link TEXT,
  city TEXT,
  address TEXT,
  about TEXT,
  logo_url TEXT,
  cover_url TEXT,
  map_link TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_supplier_profiles_user_id ON public.supplier_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_profiles_user_id ON public.restaurant_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 5. RLS Policies - Public read
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Supplier policies
CREATE POLICY "Supplier profiles are readable by authenticated users"
  ON public.supplier_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Suppliers can update own profile"
  ON public.supplier_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can insert own profile"
  ON public.supplier_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Restaurant policies
CREATE POLICY "Restaurant profiles are readable by authenticated users"
  ON public.restaurant_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Restaurants can update own profile"
  ON public.restaurant_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Restaurants can insert own profile"
  ON public.restaurant_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'supplier')
  );

  -- Create supplier profile if role is supplier
  IF NEW.raw_user_meta_data->>'role' = 'supplier' THEN
    INSERT INTO public.supplier_profiles (user_id, company_name, contact_person, phone)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'company_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;

  -- Create restaurant profile if role is restaurant
  IF NEW.raw_user_meta_data->>'role' = 'restaurant' THEN
    INSERT INTO public.restaurant_profiles (user_id, restaurant_name, contact_person, phone)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'restaurant_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

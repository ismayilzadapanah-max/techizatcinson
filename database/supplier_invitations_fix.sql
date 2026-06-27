-- ============================================================
-- supplier_invitations — role sütunu fix + schema cache reload
-- Supabase SQL Editor-da icra edin
-- ============================================================

-- 1. Cədvəl mövcuddursa amma role sütunu yoxdursa — əlavə et
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'supplier_invitations'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'supplier_invitations'
        AND column_name = 'role'
    ) THEN
      ALTER TABLE public.supplier_invitations
        ADD COLUMN role text NOT NULL DEFAULT 'viewer'
        CHECK (role IN ('manager','orders_manager','stock_manager',
                        'product_manager','finance_manager','viewer'));
      RAISE NOTICE 'role sütunu əlavə edildi';
    ELSE
      RAISE NOTICE 'role sütunu artıq mövcuddur';
    END IF;
  ELSE
    RAISE NOTICE 'supplier_invitations cədvəli tapılmadı — tam quraşdırma lazımdır';
  END IF;
END $$;

-- 2. Digər əskik sütunları da yoxla
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='full_name') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='phone') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='expires_at') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='accepted_at') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN accepted_at timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='token') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN token text UNIQUE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='supplier_invitations' AND column_name='status') THEN
    ALTER TABLE public.supplier_invitations ADD COLUMN status text NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending','accepted','expired','cancelled'));
  END IF;
END $$;

-- 3. Schema cache-i yenilə (bu hər zaman işlədilməlidir)
NOTIFY pgrst, 'reload schema';

SELECT 'Fix tamamlandı — schema cache yeniləndi' AS result;

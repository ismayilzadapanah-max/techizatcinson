@AGENTS.md

# tECHIZATCIN VEB SAYT

## Layihə haqqında
**Techizatcin.com** — Restoranlar, restoran şəbəkələri və təchizatçılar üçün B2B məhsul elan platforması (marketplace).  
Saytın dili: **Azərbaycan dili**.  
Dizayn: Premium dark mode hero, açıq kontent sahələri, korporativ SaaS havası, marketplace/elan platforması məntiqi.

## Texnologiya steki
- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4** (CSS-based config, `@theme inline`)
- **TypeScript 5**
- **Material Symbols Outlined** (Google ikon fontu)

## Fayl strukturu
```
src/
├── app/                    # Next.js App Router səhifələri
│   ├── layout.tsx          # Root layout (Header + Footer)
│   ├── page.tsx            # Ana səhifə
│   ├── products/           # Məhsul səhifələri
│   ├── suppliers/          # Təchizatçı səhifələri
│   ├── login/              # Giriş
│   ├── register/           # Qeydiyyat (supplier + restaurant)
│   ├── for-restaurants/    # Restoranlar üçün landing
│   ├── for-suppliers/      # Təchizatçılar üçün landing
│   ├── contact/            # Əlaqə səhifəsi
│   ├── account/            # İstifadəçi kabineti
│   │   ├── supplier/       # Təchizatçı kabineti
│   │   └── restaurant/     # Restoran kabineti
│   └── admin/              # Admin panel
├── components/
│   ├── layout/             # Header, Footer, MobileMenu
│   ├── ui/                 # EmptyState, Badge, Modal, Tabs, Pagination, StatsCard...
│   ├── marketplace/        # ProductCard, SupplierCard, SearchBar, FilterSidebar...
│   ├── admin/              # AdminSidebar
│   └── account/            # SupplierAccountSidebar, RestaurantAccountSidebar
└── lib/
    ├── types.ts            # Full stack data modelləri
    └── constants.ts        # Sayt mətnləri, boş state mesajları
```

## Vacib qaydalar
1. **Heç bir demo data istifadə etmə.** Bütün siyahılar boş state ilə başlasın.
2. Bütün səhifələr responsive (mobil, tablet, desktop).
3. Sayt tam Azərbaycan dilindədir.
4. Rəng palitrası: #0B0E3B, #15164F, #1A1D60, #243786, #141647, #F4F5F9, #E9E8EE, #F3F2F7, #A4A4B0, #5D608B, #9DB1CA, #D47092

## İşə salma
```bash
npm run dev    # http://localhost:3000
npm run build  # Production build
```

// ============================================================
// Sabitlər — Sayt konfiqurasiyası, mətnlər, boş state mesajları
// ============================================================

export const SITE = {
  name: 'Techizatcin.com',
  tagline: 'Restoranlar və təchizatçılar üçün ağıllı B2B marketplace',
  description: 'Azərbaycanın ən böyük B2B təchizat platforması. Restoranlar və təchizatçılar üçün vahid rəqəmsal ekosistem.',
  url: 'https://techizatcin.com',
  locale: 'az',
} as const;

export const NAV_LINKS = [
  { label: 'Ana səhifə', href: '/' },
  { label: 'Məhsullar', href: '/products' },
  { label: 'Təchizatçılar', href: '/suppliers' },
  { label: 'Kateqoriyalar', href: '/categories' },
  { label: 'Restoranlar üçün', href: '/for-restaurants' },
  { label: 'Təchizatçılar üçün', href: '/for-suppliers' },
  { label: 'Əlaqə', href: '/contact' },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: 'Ana səhifə', href: '/' },
    { label: 'Məhsullar', href: '/products' },
    { label: 'Təchizatçılar', href: '/suppliers' },
    { label: 'Qiymətlər', href: '/packages' },
  ],
  support: [
    { label: 'Yardım mərkəzi', href: '/help' },
    { label: 'Məxfilik siyasəti', href: '/privacy' },
    { label: 'İstifadə şərtləri', href: '/terms' },
    { label: 'Əlaqə', href: '/contact' },
  ],
} as const;

export const EMPTY_STATES = {
  noProducts: {
    title: 'Hələ məhsul elanı yerləşdirilməyib',
    description: 'Tezliklə burada ən yeni təchizat təkliflərini görəcəksiniz.',
    icon: 'inventory_2',
    cta: 'İlk elanı siz verin',
  },
  noSuppliers: {
    title: 'Hələ təchizatçı yoxdur',
    description: 'Platformaya qoşulan ilk təchizatçı olmaq üçün müraciət edin.',
    icon: 'group_off',
    cta: 'Təchizatçı kimi qeydiyyat',
  },
  noCategories: {
    title: 'Hələ kateqoriya əlavə edilməyib',
    description: 'Kateqoriyalar admin tərəfindən tezliklə əlavə olunacaq.',
    icon: 'category',
    cta: undefined,
  },
  noResults: {
    title: 'Axtarışa uyğun məhsul tapılmadı',
    description: 'Seçdiyiniz filtrlərə uyğun heç bir nəticə yoxdur. Zəhmət olmasa filtrləri dəyişərək yenidən yoxlayın.',
    icon: 'search_off',
    cta: 'Filtrləri sıfırla',
  },
  noFavorites: {
    title: 'Hələ favorit əlavə edilməyib',
    description: 'Bəyəndiyiniz məhsul və təchizatçıları favoritlərinizə əlavə edin.',
    icon: 'favorite',
    cta: undefined,
  },
  noMessages: {
    title: 'Hələ mesaj yoxdur',
    description: 'Təchizatçılarla əlaqə qurduqca mesajlarınız burada görünəcək.',
    icon: 'forum',
    cta: undefined,
  },
  noReviews: {
    title: 'Hələ rəy yazılmayıb',
    description: 'İlk rəyi siz yazın və təcrübənizi bölüşün.',
    icon: 'reviews',
    cta: undefined,
  },
  noRFQs: {
    title: 'Hələ sorğu yoxdur',
    description: 'Qiymət sorğularınız burada görünəcək.',
    icon: 'request_quote',
    cta: undefined,
  },
  noActivity: {
    title: 'Hələ fəaliyyət yoxdur',
    description: 'Hesabınızda hər hansı bir əməliyyat və ya bildiriş yarandıqda burada əks olunacaq.',
    icon: 'history_toggle_off',
    cta: 'İlk məhsulu əlavə edin',
  },
  noUsers: {
    title: 'Hələ istifadəçi yoxdur',
    description: 'Platformaya yeni istifadəçilər qeydiyyatdan keçdikcə burada görünəcək.',
    icon: 'person_add',
    cta: undefined,
  },
  supplierNoProducts: {
    title: 'Hələ məhsul əlavə edilməyib',
    description: 'Yeni məhsul əlavə etmək üçün aşağıdakı düyməyə klikləyin.',
    icon: 'inventory',
    cta: 'Yeni məhsul əlavə et',
  },
  supplierNoVarieties: {
    title: 'Hələ məhsul çeşidi əlavə edilməyib',
    description: 'Məhsullarınızın müxtəlif variantlarını əlavə edə bilərsiniz.',
    icon: 'style',
    cta: 'İlk məhsul çeşidini əlavə et',
  },
  noWhatsAppLink: {
    title: 'WhatsApp linki əlavə edilməyib',
    description: 'WhatsApp linki əlavə edərək restoranların sizinlə birbaşa əlaqə saxlamasını təmin edin.',
    icon: 'chat',
    cta: 'WhatsApp linki əlavə et',
  },
  profileIncomplete: {
    title: 'Profil məlumatları hələ tamamlanmayıb',
    description: 'Profilinizi tamamlamaq üçün bütün lazımi məlumatları daxil edin.',
    icon: 'assignment',
    cta: 'Profili tamamla',
  },
  noComplaints: {
    title: 'Hələ şikayət yoxdur',
    description: 'Sistemdə hər hansı aktiv şikayət və ya problem qeydə alınmayıb.',
    icon: 'notification_important',
    cta: undefined,
  },
  noPackages: {
    title: 'Hələ paket əlavə edilməyib',
    description: 'Təchizatçılar üçün elan və profil paketləri burada idarə olunacaq.',
    icon: 'package_2',
    cta: 'Yeni paket yarat',
  },
} as const;

export const APPROVAL_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: 'Gözləyir', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Təsdiqlənib', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rədd edilib', color: 'bg-red-100 text-red-700' },
  disabled: { label: 'Deaktiv edilib', color: 'bg-gray-100 text-gray-600' },
};

export const RFQ_STATUSES: Record<string, string> = {
  pending: 'Gözləyir',
  answered: 'Cavablandırılıb',
  accepted: 'Qəbul edilib',
  rejected: 'Rədd edilib',
  expired: 'Müddəti bitib',
};

export const COMPLAINT_STATUSES: Record<string, string> = {
  new: 'Yeni',
  reviewing: 'Baxılır',
  resolved: 'Həll edildi',
  rejected: 'Rədd edildi',
};

export const ORDER_STATUSES: Record<string, { label: string; color: string; icon: string }> = {
  pending:     { label: 'Gözləyir',        color: 'bg-amber-100 text-amber-700 border-amber-200',     icon: 'schedule' },
  accepted:    { label: 'Qəbul edildi',    color: 'bg-blue-100 text-blue-700 border-blue-200',        icon: 'check_circle' },
  preparing:   { label: 'Hazırlanır',      color: 'bg-purple-100 text-purple-700 border-purple-200',  icon: 'inventory' },
  on_delivery: { label: 'Çatdırılmadadır', color: 'bg-orange-100 text-orange-700 border-orange-200',  icon: 'local_shipping' },
  delivered:   { label: 'Çatdırıldı',     color: 'bg-green-100 text-green-700 border-green-200',     icon: 'done_all' },
  completed:   { label: 'Tamamlandı',      color: 'bg-green-100 text-green-800 border-green-200',     icon: 'task_alt' },
  cancelled:   { label: 'Ləğv edildi',     color: 'bg-red-100 text-red-700 border-red-200',           icon: 'cancel' },
  rejected:    { label: 'Rədd edildi',     color: 'bg-red-100 text-red-700 border-red-200',           icon: 'block' },
};

// Təchizatçının edə biləcəyi status keçidləri
export const SUPPLIER_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending:     ['accepted', 'rejected'],
  accepted:    ['preparing', 'cancelled'],
  preparing:   ['on_delivery', 'cancelled'],
  on_delivery: ['delivered'],
  delivered:   ['completed'],
  completed:   [],
  cancelled:   [],
  rejected:    [],
};

export const HERO_CONTENT = {
  title: 'Restoranlar üçün təchizatçı və məhsul tapma platforması',
  subtitle: 'Restoranınız üçün lazım olan məhsulları tapın, təchizatçı profillərinə baxın, qiymət sorğusu göndərin və birbaşa WhatsApp üzərindən əlaqə qurun.',
} as const;

// ============================================================
// Kateqoriya və alt kateqoriya siyahısı
// ============================================================
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  slug: string;
  subcategories: { id: string; name: string }[];
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: "vegetables",
    name: "Tərəvəz",
    icon: "eco",
    slug: "terevez",
    subcategories: [
      { id: "seasonal-veg", name: "Mövsümi" },
      { id: "import-veg", name: "İdxal" },
      { id: "local-veg", name: "Yerli" },
      { id: "organic-veg", name: "Üzvi" },
      { id: "frozen-veg", name: "Dondurulmuş" },
    ],
  },
  {
    id: "fruits",
    name: "Meyvə",
    icon: "nutrition",
    slug: "meyve",
    subcategories: [
      { id: "seasonal-fruit", name: "Mövsümi" },
      { id: "import-fruit", name: "İdxal" },
      { id: "local-fruit", name: "Yerli" },
      { id: "tropical-fruit", name: "Tropik" },
      { id: "dried-fruit", name: "Qurudulmuş" },
    ],
  },
  {
    id: "meat-poultry",
    name: "Ət və quş əti",
    icon: "kebab_dining",
    slug: "et-ve-qus-eti",
    subcategories: [
      { id: "beef", name: "Mal əti" },
      { id: "lamb", name: "Qoyun əti" },
      { id: "chicken", name: "Toyuq" },
      { id: "turkey", name: "Hinduşka" },
      { id: "processed-meat", name: "Emal olunmuş ət" },
    ],
  },
  {
    id: "dairy",
    name: "Süd məhsulları",
    icon: "egg_alt",
    slug: "sud-mehsullari",
    subcategories: [
      { id: "milk", name: "Süd" },
      { id: "cheese", name: "Pendir" },
      { id: "yogurt", name: "Qatıq" },
      { id: "butter", name: "Yağ" },
      { id: "cream", name: "Qaymaq" },
    ],
  },
  {
    id: "seafood",
    name: "Dəniz məhsulları",
    icon: "set_meal",
    slug: "deniz-mehsullari",
    subcategories: [
      { id: "fish", name: "Balıq" },
      { id: "shrimp", name: "Krevet" },
      { id: "caviar", name: "Kürü" },
      { id: "frozen-seafood", name: "Dondurulmuş" },
      { id: "canned-seafood", name: "Konservləşdirilmiş" },
    ],
  },
  {
    id: "bakery",
    name: "Çörək və un məmulatları",
    icon: "bakery_dining",
    slug: "chorek-ve-un",
    subcategories: [
      { id: "bread", name: "Çörək" },
      { id: "pastry", name: "Şirniyyat" },
      { id: "pasta", name: "Makaron" },
      { id: "flour", name: "Un" },
      { id: "cake", name: "Tort və keks" },
    ],
  },
  {
    id: "beverages",
    name: "İçkilər",
    icon: "local_drink",
    slug: "ickiler",
    subcategories: [
      { id: "water", name: "Su" },
      { id: "juice", name: "Şirə" },
      { id: "tea", name: "Çay" },
      { id: "coffee", name: "Qəhvə" },
      { id: "soft-drink", name: "Qazlı içkilər" },
      { id: "alcohol", name: "Alkoqollu içkilər" },
    ],
  },
  {
    id: "dry-goods",
    name: "Quru qidalar",
    icon: "grocery",
    slug: "quru-qidalar",
    subcategories: [
      { id: "rice", name: "Düyü" },
      { id: "pulses", name: "Paxlalılar" },
      { id: "oil", name: "Yağlar" },
      { id: "sugar", name: "Şəkər" },
      { id: "canned-food", name: "Konservlər" },
      { id: "sauces", name: "Souslar" },
    ],
  },
  {
    id: "spices",
    name: "Ədviyyatlar",
    icon: "restaurant",
    slug: "edviyyatlar",
    subcategories: [
      { id: "herbs", name: "Göyərti" },
      { id: "spice-mix", name: "Qarışıq ədviyyat" },
      { id: "salt", name: "Duz" },
      { id: "pepper", name: "İstiot" },
    ],
  },
  {
    id: "cleaning",
    name: "Təmizlik və gigiyena",
    icon: "cleaning_services",
    slug: "temizlik-gigiyena",
    subcategories: [
      { id: "detergent", name: "Yuyucu vasitələr" },
      { id: "disinfectant", name: "Dezinfeksiya" },
      { id: "disposable", name: "Birdəfəlik məhsullar" },
      { id: "napkin", name: "Salfetlər" },
    ],
  },
  {
    id: "equipment",
    name: "Avadanlıqlar",
    icon: "kitchen",
    slug: "avadanliqlar",
    subcategories: [
      { id: "kitchen-equip", name: "Mətbəx avadanlığı" },
      { id: "refrigeration", name: "Soyuducu avadanlıq" },
      { id: "furniture", name: "Mebel" },
      { id: "tableware", name: "Qab-qacaq" },
      { id: "pos", name: "Kassa və POS sistemləri" },
    ],
  },
  {
    id: "packaging",
    name: "Qablaşdırma",
    icon: "package_2",
    slug: "qablasdirma",
    subcategories: [
      { id: "plastic", name: "Plastik qablar" },
      { id: "paper", name: "Kağız qablaşdırma" },
      { id: "eco-pack", name: "Eko qablaşdırma" },
      { id: "bags", name: "Paket və çantalar" },
    ],
  },
];

// Rəng palitrası (referans üçün)
export const COLORS = {
  brandDark: '#0B0E3B',
  brandHero: '#15164F',
  brandMid: '#1A1D60',
  brandBlue: '#243786',
  brandBtn: '#141647',
  brandLightBg: '#F4F5F9',
  brandFormCard: '#E9E8EE',
  brandInput: '#F3F2F7',
  brandGrayText: '#A4A4B0',
  brandMuted: '#5D608B',
  brandSoftBlue: '#9DB1CA',
  brandAccent: '#D47092',
} as const;

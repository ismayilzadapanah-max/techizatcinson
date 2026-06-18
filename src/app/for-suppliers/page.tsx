import Link from "next/link";

const features = [
  { icon: "business", title: "Şirkət profilini yarat", desc: "Şirkətinizi, məhsullarınızı və xidmətlərinizi tanıdan premium profil səhifəsi." },
  { icon: "inventory_2", title: "Məhsul çeşidlərini əlavə et", desc: "Limitsiz məhsul, variant və qiymət əlavə edin. Kataloqunuzu daim yeniləyin." },
  { icon: "request_quote", title: "Restoranlardan sorğu qəbul et", desc: "Restoranların göndərdiyi qiymət sorğularını qəbul edin və təklif verin." },
  { icon: "chat", title: "WhatsApp ilə müştəri qazan", desc: "WhatsApp yönləndirməsi ilə birbaşa müştəri ilə əlaqə qurun." },
  { icon: "category", title: "Kateqoriyalarda görün", desc: "Məhsullarınızı kateqoriyalarda göstərin, axtarışda üst sıralara çıxın." },
  { icon: "verified_user", title: "Profilini təsdiqlət", desc: "Təsdiqlənmiş profil badge-i ilə restoranların etibarını qazanın." },
];

export default function ForSuppliersPage() {
  return (
    <div className="bg-background">
      <section className="py-20 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Məhsullarınızı minlərlə restorana çatdırın</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-sm mb-8">Azərbaycanın ən böyük B2B təchizat platformasında profil yaradın, elanlarınızı yerləşdirin, birbaşa sifarişlər alın.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/register/supplier" className="inline-flex items-center gap-2 bg-[#D47092] text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all text-sm">
            Təchizatçı kimi qeydiyyatdan keç
          </Link>
        </div>
      </section>

      <section className="py-16 max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-secondary/20 transition-all">
              <div className="w-12 h-12 bg-[#7e2b4b] rounded-lg flex items-center justify-center text-secondary mb-4">
                <span className="material-symbols-outlined text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 text-center px-4 bg-surface-container-low border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Satışlarınızı artırmağa hazırsınız?</h2>
        <p className="text-on-surface-variant mb-8 text-sm">Premium təchizatçı kimi qeydiyyatdan keçin.</p>
        <Link href="/register/supplier" className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all text-sm">
          Pulsuz başlayın
        </Link>
      </section>
    </div>
  );
}

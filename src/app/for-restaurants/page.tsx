import Link from "next/link";

const features = [
  { icon: "search", title: "Məhsul axtarışı", desc: "Minlərlə məhsul arasından filtr və kateqoriyalarla dəqiq axtarış edin." },
  { icon: "compare_arrows", title: "Təchizatçı müqayisəsi", desc: "Qiymət, keyfiyyət və çatdırılma şərtlərinə görə təchizatçıları müqayisə edin." },
  { icon: "chat", title: "WhatsApp ilə sürətli əlaqə", desc: "Bir kliklə WhatsApp üzərindən birbaşa əlaqə qurun." },
  { icon: "request_quote", title: "Qiymət sorğusu", desc: "Topdan sifarişlər üçün xüsusi qiymət təklifi alın." },
  { icon: "favorite", title: "Favorit təchizatçılar", desc: "Etibarlı təchizatçılarınızı favoritləyin, daim əlinizin altında olsun." },
  { icon: "handshake", title: "Uzunmüddətli əməkdaşlıq", desc: "Təchizatçılarla davamlı işbirliyi qurun, xüsusi şərtlər əldə edin." },
];

export default function ForRestaurantsPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Restoranınız üçün ən yaxşı təchizatçıları tapın</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-sm mb-8">Məhsul axtarın, təchizatçıları müqayisə edin, birbaşa əlaqə qurun və sifarişlərinizi optimallaşdırın.</p>
        <Link href="/register/restaurant" className="inline-flex items-center gap-2 bg-[#D47092] text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all text-sm">
          Restoran kimi qeydiyyatdan keç
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="py-16 max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-[#243786] rounded-lg flex items-center justify-center text-white mb-4">
                <span className="material-symbols-outlined text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-on-surface-variant">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center px-4 bg-surface-container-low border-t border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Təchizat zəncirinizi sadələşdirin</h2>
        <p className="text-on-surface-variant mb-8 text-sm">Bütün təchizatçılarınızla vahid platformada işləyin.</p>
        <Link href="/register/restaurant" className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all text-sm">
          Pulsuz qeydiyyatdan keç
        </Link>
      </section>
    </div>
  );
}

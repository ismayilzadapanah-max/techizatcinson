export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Əlaqə</h1>
          <p className="text-sm text-on-surface-variant">Suallarınız və təklifləriniz üçün bizimlə əlaqə saxlayın.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E9E8EE]">
            <h3 className="text-lg font-semibold text-[#141647] mb-6">Mesaj göndər</h3>
            <form className="space-y-4">
              {[
                { label: "Adınız", placeholder: "Ad və Soyad", icon: "person" },
                { label: "E-mail", placeholder: "example@mail.com", icon: "mail", type: "email" },
                { label: "Telefon", placeholder: "+994 (50) 000-00-00", icon: "call", type: "tel" },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs text-brand-muted font-semibold">{f.label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-brand-soft-blue text-sm">{f.icon}</span>
                    <input type={f.type || "text"} placeholder={f.placeholder} className="w-full pl-10 pr-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors" />
                  </div>
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Mövzu</label>
                <input type="text" placeholder="Mesaj mövzusu" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">Mesaj</label>
                <textarea rows={5} placeholder="Mesajınızı yazın..." className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm text-[#141647] outline-none focus:border-[#243786] transition-colors resize-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#141647] text-white rounded-lg font-semibold text-sm hover:bg-[#243786] transition-colors">Göndər</button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E9E8EE]">
              <h3 className="text-lg font-semibold text-[#141647] mb-6">Əlaqə məlumatları</h3>
              <div className="space-y-4">
                {[
                  { icon: "call", label: "Telefon", value: "Əlaqə telefonu əlavə edilməyib" },
                  { icon: "chat", label: "WhatsApp", value: "WhatsApp nömrəsi əlavə edilməyib" },
                  { icon: "mail", label: "E-mail", value: "E-mail əlavə edilməyib" },
                  { icon: "location_on", label: "Ünvan", value: "Ünvan əlavə edilməyib" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#243786] mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-brand-muted font-semibold">{item.label}</p>
                      <p className="text-sm text-brand-muted">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E9E8EE] h-64 flex items-center justify-center border-2 border-dashed border-[#E9E8EE]">
              <div className="text-center text-brand-muted">
                <span className="material-symbols-outlined text-4xl">map</span>
                <p className="text-sm mt-2">Xəritə yeri göstərilməyib</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

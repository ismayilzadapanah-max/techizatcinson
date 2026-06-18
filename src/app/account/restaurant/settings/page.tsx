export default function RestaurantSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#141647] mb-1">Ayarlar</h2>
        <p className="text-sm text-brand-muted">Hesab ayarlarınızı idarə edin.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8 space-y-8">
        {/* Account Settings */}
        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">
            Hesab məlumatları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["E-mail", "Cari şifrə", "Yeni şifrə", "Yeni şifrə (təkrar)"].map((label) => (
              <div key={label} className="space-y-1">
                <label className="text-xs text-brand-muted font-semibold">{label}</label>
                <input
                  type={label.includes("şifrə") ? "password" : "email"}
                  className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]"
                  placeholder={
                    label === "E-mail"
                      ? "restoran@domain.az"
                      : label === "Cari şifrə"
                        ? "Cari şifrənizi daxil edin"
                        : "Yeni şifrə"
                  }
                />
              </div>
            ))}
          </div>
          <button className="mt-4 bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#243786] transition-colors">
            Şifrəni yenilə
          </button>
        </section>

        {/* Notification Settings */}
        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">
            Bildiriş ayarları
          </h3>
          <div className="space-y-3">
            {[
              "Yeni məhsul əlavə edildikdə e-mail",
              "Yeni rəy gəldikdə e-mail",
              "Sorğu cavablandırıldıqda bildiriş",
              "Favorit təchizatçı aktiv olduqda bildiriş",
            ].map((label) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#243786] cursor-pointer"
                  defaultChecked
                />
                <span className="text-sm text-brand-muted">{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Privacy Settings */}
        <section>
          <h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">
            Fəaliyyət göstərici
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded text-[#243786] cursor-pointer" defaultChecked />
              <span className="text-sm text-brand-muted">Digərlərin mənə görə hesabımı görmə icazəsi</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded text-[#243786] cursor-pointer" defaultChecked />
              <span className="text-sm text-brand-muted">Təchizatçılar mənə maraqlı məhsullar göndərə bilərlər</span>
            </label>
          </div>
        </section>

        {/* Dangerous Actions */}
        <section className="border-t border-red-100 pt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Təhlükəli əməliyyatlar</h3>
          <p className="text-xs text-brand-muted mb-4">
            Hesabınızı deaktiv etmək istəsəniz, bu əməliyyat geri qaytarıla bilməz.
          </p>
          <button className="border border-red-300 text-red-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors">
            Hesabı deaktiv et
          </button>
        </section>
      </div>
    </div>
  );
}

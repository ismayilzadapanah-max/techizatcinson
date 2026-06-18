export default function SupplierSettingsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Ayarlar</h2><p className="text-sm text-brand-muted">Hesab ayarlarınızı idarə edin.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8 space-y-8">
        <section><h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Hesab məlumatları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["E-mail","Cari şifrə","Yeni şifrə","Yeni şifrə (təkrar)"].map(l=><div key={l} className="space-y-1"><label className="text-xs text-brand-muted font-semibold">{l}</label><input type={l.includes("şifrə")?"password":"email"} className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786]" /></div>)}
          </div>
          <button className="mt-4 bg-[#141647] text-white px-6 py-2.5 rounded-lg font-semibold text-sm">Şifrəni yenilə</button>
        </section>
        <section><h3 className="text-lg font-semibold text-[#141647] mb-4 pb-3 border-b border-[#E9E8EE]">Bildiriş ayarları</h3>
          {["Yeni sorğu gəldikdə e-mail","Yeni rəy gəldikdə e-mail","Məhsul təsdiqləndikdə bildiriş"].map(l=><label key={l} className="flex items-center gap-3 mb-3 cursor-pointer"><input type="checkbox" className="rounded text-[#243786]" defaultChecked /><span className="text-sm text-brand-muted">{l}</span></label>)}
        </section>
        <section className="border-t border-red-100 pt-6"><h3 className="text-lg font-semibold text-red-600 mb-2">Təhlükəli əməliyyatlar</h3><p className="text-xs text-brand-muted mb-4">Hesabınızı deaktiv etmək istəsəniz, bu əməliyyat geri qaytarıla bilməz.</p><button className="border border-red-300 text-red-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors">Hesabı deaktiv et</button></section>
      </div>
    </div>
  );
}

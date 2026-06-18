export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-[#141647] mb-1">Sayt ayarları</h2><p className="text-sm text-brand-muted">Ümumi sayt konfiqurasiyasını idarə edin.</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-[#E9E8EE] p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Sayt adı","Logo URL","Favicon URL","Əlaqə telefonu","WhatsApp nömrəsi","E-mail","SEO başlıq","SEO açıqlama"].map((label)=>(
            <div key={label} className="space-y-1">
              <label className="text-xs text-brand-muted font-semibold">{label}</label>
              <input type="text" className="w-full px-4 py-2.5 bg-[#F3F2F7] border border-[#E9E8EE] rounded-lg text-sm outline-none focus:border-[#243786] transition-colors" placeholder={label} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded text-[#243786]" /><span className="text-sm text-brand-muted">Maintenance mode</span></label>
        </div>
        <button className="mt-8 bg-[#141647] text-white px-8 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">Yadda saxla</button>
      </div>
    </div>
  );
}

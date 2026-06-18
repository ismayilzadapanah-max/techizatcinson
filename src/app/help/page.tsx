import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function HelpPage() {
  const faqs = [
    {
      q: "Necə qeydiyyatdan keçə biləm?",
      a: "Ana səhifədə 'Qeydiyyat' düyməsinə basın və istəniləndən keçin (Supplier/Restoran).",
    },
    {
      q: "Məhsul elanı necə yerləşdirə biləm?",
      a: "Supplier kimi giriş etdikdən sonra 'Kabinet' bölməsində 'Məhsul Əlavə Et' düyməsinə basın.",
    },
    {
      q: "Mən Restoran kimi hesabım olsa, məhsul satın ala biləmmi?",
      a: "Bəli, Restoran hesabı ilə məhsulları axtarıb təchizatçılarla əlaqə saxlaya bilərsiniz.",
    },
    {
      q: "Şifrəmi unuttum, necə sıfırlaya biləm?",
      a: "Login səhifəsində 'Şifrəni Unuttum' düyməsinə basın və e-poçt ünvanınızı daxil edin.",
    },
    {
      q: "Əlaqə məlumatlarım təhlükəsiz olur mu?",
      a: "Bəli, bütün məlumatlar şifrələnmiş şəkildə saxlanılır və qanuna uyğun qorunur.",
    },
    {
      q: "Elan silə biləmmi?",
      a: "Supplier kimi 'Məhsullarım' bölməsində düzəltmə/silmə əməliyyatlarını həyata keçirə bilərsiniz.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Yardım Mərkəzi" }]} />
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#141647] mb-4">Yardım Mərkəzi</h1>
          <p className="text-lg text-[#5D608B] max-w-2xl mx-auto">
            Sürətli cavablar tapmaq üçün burada keçin. Əgər sualınız cavapsız qalsa, bizimlə əlaqə saxlayın.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-[#E9E8EE] overflow-hidden max-w-3xl mx-auto">
          <div className="divide-y divide-[#E9E8EE]">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group cursor-pointer hover:bg-[#F4F5F9] transition-colors"
              >
                <summary className="flex items-center justify-between p-6 select-none">
                  <h3 className="font-semibold text-[#141647] text-lg">{faq.q}</h3>
                  <span className="material-symbols-outlined text-[#243786] group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[#5D608B]">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-[#243786]/10 to-[#D47092]/10 rounded-2xl border border-[#243786]/20 p-8 text-center max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-[#243786] text-4xl mx-auto block mb-4">
            mail
          </span>
          <h2 className="text-xl font-bold text-[#141647] mb-2">Hələ sualınız var?</h2>
          <p className="text-[#5D608B] mb-6">
            Bizimlə əlaqə saxlayın, bizim komanda sizi kömək edəcəyə hazırdır.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#243786] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#141647] transition-colors"
          >
            Bizə Yazın
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#243786] hover:underline font-semibold text-sm">
            ← Əsas səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}

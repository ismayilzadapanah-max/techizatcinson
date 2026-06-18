import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Məxfilik siyasəti" }]} />
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#E9E8EE] p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#141647] mb-6">Məxfilik Siyasəti</h1>

          <div className="prose prose-sm max-w-none text-[#5D608B] space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">1. Giriş</h2>
              <p>
                Techizatcin.com ("Biz", "Bizim", "Şirkət") sizin məxfilik hüquqlarına hörmət edirik. Bu Məxfilik Siyasəti
                bizim vebsaytında və ya mobil tətbiqlərimizdə məlumatların necə toplanması, istifadəsi və qorunması
                haqqında məlumat verir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">2. Toplanan Məlumatlar</h2>
              <p>Aşağıdakı məlumatları toplaya bilərik:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Şəxsi məlumatlar: Ad, E-poçt, Telefon Nömrəsi</li>
                <li>Şirkət Məlumatları: Şirkət Adı, Ünvanı, Fəaliyyət Sahəsi</li>
                <li>Teknik Məlumatlar: IP Ünvanı, Brauzer Tipi, Səhifə Tarixçəsi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">3. Məlumatların İstifadəsi</h2>
              <p>Toplanan məlumatlar aşağıdakı məqsədlər üçün istifadə edilir:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Xidmətlərimizi təmin etmək və yaxşılaştırmaq</li>
                <li>Sizinlə əlaqə saxlamaq</li>
                <li>Təhlükəsizlik və Qanun Əleyhinə Mübarizə</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">4. Məlumatların Qorunması</h2>
              <p>
                Biz müvafiq texniki və təşkilati tədbirlər vasitəsilə sizin məlumatlarını qorunmayan giriş,
                dəyişdirilmə və imhasından qorumağa çalışırıq.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">5. Əlaqə</h2>
              <p>
                Məxfilik siyasətimiz haqqında suallarınız varsa, lütfən{" "}
                <Link href="/help" className="text-[#243786] hover:underline font-semibold">
                  Yardım Mərkəzinə
                </Link>{" "}
                müraciət edin.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E9E8EE]">
            <Link href="/" className="text-[#243786] hover:underline font-semibold text-sm">
              ← Əsas səhifəyə qayıt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

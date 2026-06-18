import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: "İstifadə Şərtləri" }]} />
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#E9E8EE] p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#141647] mb-6">İstifadə Şərtləri</h1>

          <div className="prose prose-sm max-w-none text-[#5D608B] space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">1. Qəbul</h2>
              <p>
                Bu Vebsaytı istifadə etməklə, siz bu İstifadə Şərtlərinin bütün şərtlərini qəbul edirsiz. Əgər
                siz bu şərtləri qəbul etmirsinizsə, zəhmət olmasa bu vebsaytı istifadə etməyin.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">2. Xidmətin Təsviri</h2>
              <p>
                Techizatcin.com B2B marketplace olarak Restoranlar, Restoran Şəbəkələri və Təchizatçılar arasında
                məhsul elanlarının paylaşılması xidməti təmin edir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">3. İstifadəçi Məsuliyyəti</h2>
              <p>Siz aşağıdakılardan məsul olursunuz:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Doğru və tam məlumat təmin etmək</li>
                <li>Qanuna uyğun məhsullar elan etmək</li>
                <li>Digər istifadəçilərin hüquqlarına saygı göstərmək</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">4. Mədən Müddəalar</h2>
              <p>
                Vebsayt "OLDUĞU KİMİ" təmin edilir. Biz xidmətin davamlılığını və ya səhvlərin olmadığını
                təmin etmirik.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">5. Məsuliyyətlərin Məhdudlaşdırılması</h2>
              <p>
                Bizim maximum məsuliyyətimiz, istifadəçinin bizə ödədiyi məbləğdən çox olmayacaq (bir varsa).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">6. Dəyişikliklər</h2>
              <p>
                Biz bu şərtləri istənilən vaxt dəyişə bilərik. Vebsaytı istifadə etməyə davam etməklə, siz yeni
                şərtləri qəbul edirsiz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#141647] mb-3">7. Əlaqə</h2>
              <p>
                İstifadə Şərtləri haqqında suallarınız varsa, lütfən{" "}
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

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth-context";

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products: never[] = [];

  const handlePostAd = () => {
    if (isLoggedIn && role === "supplier") {
      router.push("/account/supplier/products/create");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F9]">
      {/* Page Header */}
      <div className="bg-background pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors mb-3"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Bütün kateqoriyalar
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#243786]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#243786] text-3xl">
                {category!.icon}
              </span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {category!.name}
              </h1>
              <p className="text-sm text-on-surface-variant">
                Bu kateqoriyada olan bütün məhsulları kəşf edin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[var(--spacing-container)] mx-auto px-4 lg:px-8 py-8">
        {products.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title="Bu kateqoriyada hələ məhsul yoxdur"
            description={`"${category!.name}" kateqoriyası üzrə məhsul elanı hələ yerləşdirilməyib. İlk elanı siz verin.`}
            cta="Elan yerləşdir"
            onCta={handlePostAd}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Product cards would render here */}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#A4A4B0] hover:text-[#141647] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {isLoggedIn && role !== "supplier" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-[#D47092]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-[#D47092]">info</span>
                </div>
                <h2 className="text-xl font-bold text-[#141647] text-center mb-2">
                  Təchizatçı hesabı tələb olunur
                </h2>
                <p className="text-sm text-[#5D608B] text-center mb-6">
                  Elan yerləşdirmək üçün təchizatçı kimi qeydiyyatdan keçməlisiniz.
                </p>
                <Link
                  href="/register/supplier"
                  className="block w-full bg-[#243786] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#141647] transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Təchizatçı kimi qeydiyyat
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#243786]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-[#243786]">add_business</span>
                </div>
                <h2 className="text-xl font-bold text-[#141647] text-center mb-2">
                  Elan yerləşdirmək üçün daxil olun
                </h2>
                <p className="text-sm text-[#5D608B] text-center mb-6">
                  Məhsul elanı yerləşdirmək üçün hesabınıza daxil olun və ya yeni hesab yaradın.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login?redirect=/account/supplier/products/create"
                    className="block w-full bg-[#243786] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#141647] transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Daxil ol
                  </Link>
                  <Link
                    href="/register/supplier"
                    className="block w-full border border-[#243786] text-[#243786] text-center py-3 rounded-xl font-semibold hover:bg-[#243786]/5 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Qeydiyyatdan keç
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

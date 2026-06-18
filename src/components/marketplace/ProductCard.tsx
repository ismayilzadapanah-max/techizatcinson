import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneRevealButton } from "./PhoneRevealButton";
import type { ProductListing } from "@/lib/types";

interface ProductCardProps {
  product: ProductListing;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.find((img) => img.isMain)?.url || product.images?.[0]?.url;

  return (
    <div className="bg-white rounded-xl border border-[#E9E8EE] overflow-hidden workspace-shadow group hover:border-[#243786]/20 transition-all">
      {/* Image */}
      <div className="aspect-[4/3] bg-[#F3F2F7] relative overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt={product.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-brand-soft-blue">inventory_2</span>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            targetId={product.id}
            targetType="product"
            initialState={false}
          />
        </div>
        {product.stockStatus === "in_stock" && (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
            Stokda
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider">
              {product.categoryName}
            </span>
            <h3 className="text-sm font-semibold text-[#141647] line-clamp-2 mt-0.5">
              {product.productName}
            </h3>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-[#141647]">
            {product.price.toFixed(2)} ₼
          </span>
          <span className="text-xs text-brand-muted">/ {product.priceUnit}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-brand-muted">
          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
          <span>{product.supplierName}</span>
        </div>

        <div className="flex flex-wrap gap-1 text-[10px] text-brand-muted">
          <span className="bg-[#F3F2F7] px-2 py-0.5 rounded">
            Min: {product.minOrderQty} {product.priceUnit}
          </span>
          <span className="bg-[#F3F2F7] px-2 py-0.5 rounded">
            {product.deliveryRegions?.[0] || "Bütün bölgələr"}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#E9E8EE]">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 text-center text-xs font-semibold text-[#243786] hover:bg-[#F3F2F7] py-2 rounded-lg transition-colors"
          >
            Ətraflı bax
          </Link>
          <WhatsAppButton
            phone={product.contactWhatsapp}
            link={product.contactWhatsappLink}
            size="sm"
          />
          <PhoneRevealButton phone={product.contactPhone} size="sm" />
        </div>
      </div>
    </div>
  );
}

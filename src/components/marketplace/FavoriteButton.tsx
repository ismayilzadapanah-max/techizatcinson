"use client";

import { useState } from "react";

interface FavoriteButtonProps {
  targetId: string;
  targetType: "product" | "supplier";
  initialState?: boolean;
}

export function FavoriteButton({
  targetId,
  targetType,
  initialState = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialState);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
      }}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
        isFavorited
          ? "bg-[#D47092] text-white shadow-lg shadow-[#D47092]/30"
          : "bg-white/80 backdrop-blur-sm text-brand-muted hover:text-[#D47092] hover:bg-white"
      }`}
      aria-label={isFavorited ? "Favoritlərdən çıxar" : "Favoritlərimə əlavə et"}
    >
      <span
        className="material-symbols-outlined text-lg"
        style={{
          fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        favorite
      </span>
    </button>
  );
}

"use client";

import { useState } from "react";

interface PhoneRevealButtonProps {
  phone: string;
  size?: "sm" | "md" | "lg";
}

export function PhoneRevealButton({ phone, size = "md" }: PhoneRevealButtonProps) {
  const [revealed, setRevealed] = useState(false);

  const sizes = {
    sm: "px-2 py-1.5 text-[10px]",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      onClick={() => setRevealed(!revealed)}
      className={`flex items-center gap-1.5 border border-[#243786] text-[#243786] rounded-lg font-semibold hover:bg-[#243786]/5 transition-all ${sizes[size]}`}
    >
      <span className="material-symbols-outlined text-[16px]">call</span>
      {revealed ? (
        <span className="hidden sm:inline">{phone}</span>
      ) : (
        <span className="hidden sm:inline">Nömrəni göstər</span>
      )}
    </button>
  );
}

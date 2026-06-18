"use client";

interface WhatsAppButtonProps {
  phone?: string;
  link?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function WhatsAppButton({
  phone,
  link,
  label = "WhatsApp",
  size = "md",
}: WhatsAppButtonProps) {
  const waLink = link || (phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null);

  if (!waLink) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-outline-variant text-outline rounded-lg text-xs opacity-50 cursor-not-allowed"
        title="WhatsApp linki əlavə edilməyib"
      >
        <span className="material-symbols-outlined text-[16px]">chat</span>
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  const sizes = {
    sm: "px-2 py-1.5 text-[10px]",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 bg-[#25D366] text-white rounded-lg font-semibold hover:opacity-90 transition-all ${sizes[size]}`}
    >
      <span className="material-symbols-outlined text-[16px]">chat</span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

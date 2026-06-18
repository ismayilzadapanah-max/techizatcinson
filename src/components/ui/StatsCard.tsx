interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  variant?: "default" | "accent";
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  variant = "default",
  className = "",
}: StatsCardProps) {
  const isAccent = variant === "accent";
  return (
    <div
      className={`bg-white rounded-xl p-4 md:p-6 workspace-shadow border border-[#E9E8EE] flex items-center gap-4 group ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-[#243786] ${
          isAccent ? "bg-[#FDF2F5] text-[#D47092]" : "bg-[#E9E8EE]"
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-xs text-brand-muted uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-[#141647]">{value.toLocaleString("az")}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  cta?: string;
  onCta?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  cta,
  onCta,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`relative bg-surface-container-low rounded-2xl border border-dashed border-outline-variant p-12 flex flex-col items-center justify-center text-center min-h-[300px] ${className}`}
    >
      <div className="w-20 h-20 bg-surface-container flex items-center justify-center rounded-full mb-6">
        <span className="material-symbols-outlined text-4xl text-outline-variant">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-on-surface-variant mb-2">
        {title}
      </h3>
      <p className="text-sm text-outline max-w-md mb-6">{description}</p>
      {cta && onCta && (
        <button
          onClick={onCta}
          className="bg-[#243786] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#141647] transition-colors text-sm"
        >
          {cta}
        </button>
      )}
      {cta && !onCta && (
        <button className="bg-[#243786] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#141647] transition-colors text-sm">
          {cta}
        </button>
      )}
    </div>
  );
}

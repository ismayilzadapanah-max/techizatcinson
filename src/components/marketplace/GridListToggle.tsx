"use client";

interface GridListToggleProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export function GridListToggle({ view, onChange }: GridListToggleProps) {
  return (
    <div className="flex bg-[#F3F2F7] p-1 rounded-lg">
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded-md transition-all ${
          view === "grid" ? "bg-white shadow-sm text-[#141647]" : "text-brand-soft-blue hover:text-[#141647]"
        }`}
      >
        <span className="material-symbols-outlined text-md">grid_view</span>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded-md transition-all ${
          view === "list" ? "bg-white shadow-sm text-[#141647]" : "text-brand-soft-blue hover:text-[#141647]"
        }`}
      >
        <span className="material-symbols-outlined text-md">view_list</span>
      </button>
    </div>
  );
}

"use client";

interface Tab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-outline-variant/30">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
            activeTab === tab.id
              ? "text-primary border-secondary font-semibold"
              : "text-on-surface-variant border-transparent hover:text-primary hover:border-outline-variant"
          }`}
        >
          {tab.icon && (
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
          )}
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-surface-container-high text-xs font-semibold">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Drawer({ open, onClose, title, children, side = "left" }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const slideClass = side === "left" ? "slide-in-from-left" : "slide-in-from-right";

  return (
    <div className="fixed inset-0 z-[150] lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute ${side}-0 top-0 h-full w-[280px] bg-surface-container-lowest border-${side === "left" ? "r" : "l"} border-white/10 shadow-2xl animate-in ${slideClass} duration-300`}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="text-lg font-semibold text-on-background">{title}</span>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  );
}

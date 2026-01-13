"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ title, isOpen, onClose, children }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        // 👇 همیشه روی ویوپورت، مستقل از اسکرول
        "fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/40"
      )}
      role="dialog"
      aria-modal="true">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-soft border border-slate-200 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">
            {title ?? "Details"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600 hover:bg-slate-100">
            ×
          </button>
        </div>

        {/* داخل مودال اگر محتوا زیاد بود خودش اسکرول می‌شود، نه صفحه‌ی اصلی */}
        <div className="p-4 overflow-y-auto max-h-[78vh] text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

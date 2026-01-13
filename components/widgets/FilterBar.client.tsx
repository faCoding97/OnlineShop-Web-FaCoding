"use client";

import { useState } from "react";
import {
  CATEGORY_OPTIONS,
  SIZE_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_OPTIONS,
} from "@/constants/rug-options";

type FilterState = {
  categories: string[];
  sizes: string[];
  materials: string[];
  colors: string[];
};

type Props = {
  categories?: string[];
  sizes?: string[];
  materials?: string[];
  colors?: string[];
  onChange: (state: FilterState) => void;
};

export function FilterBar({
  categories = [],
  sizes = [],
  materials = [],
  colors = [],
  onChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const updateFilters = (updater: (prev: FilterState) => FilterState) => {
    onChange(updater({ categories, sizes, materials, colors }));
  };

  // پاک کردن همه فیلترها
  const clearAllFilters = () => {
    onChange({
      categories: [],
      sizes: [],
      materials: [],
      colors: [],
    });
  };

  const pillBase =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition cursor-pointer select-none hover:opacity-90";

  const activeClasses =
    "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]";

  const inactiveClasses =
    "border-slate-300 bg-white text-slate-700 hover:border-slate-400";

  const activeCount =
    categories.length + sizes.length + materials.length + colors.length;

  const hasActiveFilters = activeCount > 0;

  return (
    <div className="w-full">
      {/* دکمه اصلی Filters + Clear */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <>
              <span className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>

              {/* دکمه Clear all - فقط وقتی فیلتر فعال باشه */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // جلوگیری از باز/بسته شدن پنل
                  clearAllFilters();
                }}
                className="ml-2 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2 transition"
                aria-label="Clear all filters">
                Clear
              </button>
            </>
          )}
        </div>
      </button>

      {/* محتوای فیلترها */}
      {isOpen && (
        <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 space-y-5 max-h-96 overflow-y-auto">
            {/* Category */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2">
                Category
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((cat) => {
                  const active = categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        updateFilters((prev) => ({
                          ...prev,
                          categories: toggle(prev.categories, cat),
                        }))
                      }
                      className={`${pillBase} ${active ? activeClasses : inactiveClasses}`}
                      aria-pressed={active}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2">
                Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_OPTIONS.map((size) => {
                  const active = sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        updateFilters((prev) => ({
                          ...prev,
                          sizes: toggle(prev.sizes, size),
                        }))
                      }
                      className={`${pillBase} ${active ? activeClasses : inactiveClasses}`}
                      aria-pressed={active}>
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2">
                Material
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {MATERIAL_OPTIONS.map((material) => {
                  const active = materials.includes(material);
                  return (
                    <button
                      key={material}
                      type="button"
                      onClick={() =>
                        updateFilters((prev) => ({
                          ...prev,
                          materials: toggle(prev.materials, material),
                        }))
                      }
                      className={`${pillBase} ${active ? activeClasses : inactiveClasses}`}
                      aria-pressed={active}>
                      {material}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colour */}
            <div>
              <h4 className="text-xs font-semibold text-slate-600 mb-2">
                Colour
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((color) => {
                  const active = colors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        updateFilters((prev) => ({
                          ...prev,
                          colors: toggle(prev.colors, color),
                        }))
                      }
                      className={`${pillBase} ${active ? activeClasses : inactiveClasses}`}
                      aria-pressed={active}>
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

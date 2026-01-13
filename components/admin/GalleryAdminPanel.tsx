"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "@/app/admin/gallery/actions";
import {
  CATEGORY_OPTIONS,
  SIZE_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_OPTIONS,
} from "@/constants/rug-options";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

type GalleryAdminItem = {
  id: string;
  title: string;
  category: string;
  size: string;
  dimensions: string | null;
  material: string;
  origin: string | null;
  price_zar: number;
  description: string;
  image_url: string;
  created_at: string;
  colors: string[];
  badges: string[];
  gallery: string[];
};

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-full bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand)]/90 disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

/** Create new item form */
function CreateItemForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createGalleryItem, initialState);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form
      action={(formData: FormData) => {
        formData.set("colors", selectedColors.join(", "));
        formAction(formData);
      }}
      encType="multipart/form-data"
      className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 space-y-6"
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-1">
          Add new gallery item
        </h2>
        <p className="text-xs text-slate-600">
          Fill basic details and upload a main image.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">ID (slug)</label>
          <input
            name="id"
            required
            placeholder="persian-classic-red"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
          <p className="text-[10px] text-slate-500">Must be unique (database only).</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Title</label>
          <input
            name="title"
            required
            placeholder="Persian Classic Red"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Category</label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Size</label>
          <select
            name="size"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          >
            <option value="" disabled>
              Select size
            </option>
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Material</label>
          <select
            name="material"
            required
            defaultValue=""
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          >
            <option value="" disabled>
              Select material
            </option>
            {MATERIAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Dimensions (optional)</label>
          <input
            name="dimensions"
            placeholder="2.0 × 3.0 m"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Origin (optional)</label>
          <input
            name="origin"
            placeholder="Iran / Turkey / Morocco..."
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Price (ZAR)</label>
          <input
            name="price_zar"
            type="number"
            min={0}
            required
            placeholder="18500"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-slate-700">Colours (select multiple)</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((col) => {
            const active = selectedColors.includes(col);
            return (
              <button
                key={col}
                type="button"
                onClick={() => toggleColor(col)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer select-none ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Badges (comma separated, optional)</label>
        <input
          name="badges"
          placeholder="Hand-knotted, Vintage, Limited"
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Main image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="block w-full text-xs text-slate-600"
        />
        <p className="text-[10px] text-slate-500">Will be uploaded to Supabase Storage.</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <SaveButton label="Create item" />
        {state.message && (
          <p className={`text-[11px] ${state.ok ? "text-emerald-600" : "text-red-600"}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

/** Edit form for each item */
function EditItemForm({ item }: { item: GalleryAdminItem }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateGalleryItem, initialState);
  const [selectedColors, setSelectedColors] = useState<string[]>(item.colors || []);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await deleteGalleryItem(item.id);
    if (res.ok) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form
      action={(formData: FormData) => {
        formData.set("colors", selectedColors.join(", "));
        formAction(formData);
      }}
      encType="multipart/form-data"
      className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-sm"
    >
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="existing_image_url" value={item.image_url} />

      <div className="flex items-start gap-6">
        <div className="w-40 h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Title</label>
            <input
              name="title"
              required
              defaultValue={item.title}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Category</label>
            <select
              name="category"
              required
              defaultValue={item.category}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Size</label>
            <select
              name="size"
              required
              defaultValue={item.size}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Material</label>
            <select
              name="material"
              required
              defaultValue={item.material}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            >
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Dimensions</label>
            <input
              name="dimensions"
              defaultValue={item.dimensions ?? ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Origin</label>
            <input
              name="origin"
              defaultValue={item.origin ?? ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Price (ZAR)</label>
            <input
              name="price_zar"
              type="number"
              min={0}
              required
              defaultValue={item.price_zar}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={item.description}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-slate-700">Colours</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((col) => {
            const active = selectedColors.includes(col);
            return (
              <button
                key={col}
                type="button"
                onClick={() => toggleColor(col)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition cursor-pointer select-none ${
                  active
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Badges (comma separated)</label>
        <input
          name="badges"
          defaultValue={item.badges.join(", ")}
          placeholder="Hand-knotted, Vintage"
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Change main image (optional)</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="block w-full text-xs text-slate-600"
        />
        <p className="text-[10px] text-slate-500">Leave empty to keep current image.</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-3">
          <SaveButton />
          {state.message && (
            <p className={`text-[11px] ${state.ok ? "text-emerald-600" : "text-red-600"}`}>
              {state.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          Delete item
        </button>
      </div>
    </form>
  );
}

/** Main gallery admin panel with search and sorting */
export default function GalleryAdminPanel({ items }: { items: GalleryAdminItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "title" | "category" | "price_zar">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          item.category.toLowerCase().includes(lowerSearch) ||
          item.size.toLowerCase().includes(lowerSearch) ||
          item.material.toLowerCase().includes(lowerSearch) ||
          (item.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    const sorted = [...filtered];

    sorted.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === "price_zar") {
        aValue = a.price_zar;
        bValue = b.price_zar;
      } else {
        aValue = (aValue ?? "").toString().toLowerCase();
        bValue = (bValue ?? "").toString().toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [items, searchTerm, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Gallery items</h1>
          <p className="text-sm text-slate-600">
            Manage rugs shown in the public gallery. Upload images, edit details, and control colours/badges.
          </p>
        </div>
      </div>

      {/* Create new item form */}
      <CreateItemForm />

      {/* Search and sort controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search in title, category, size, material, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600 whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          >
            <option value="created_at">Creation date</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="price_zar">Price</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 rounded hover:bg-slate-100 transition"
            title="Toggle sort direction"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* List of existing items */}
      <div className="space-y-6">
        {filteredAndSortedItems.length === 0 ? (
          <p className="text-sm text-slate-600">
            {searchTerm
              ? "No items found matching your search."
              : "No items yet. Add your first rug using the form above."}
          </p>
        ) : (
          filteredAndSortedItems.map((item) => (
            <EditItemForm key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
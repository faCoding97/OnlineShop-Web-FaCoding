"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveHero, initialState } from "@/app/admin/hero/actions";

type HeroAdminProps = {
  hero: {
    id: string;
    eyebrow: string | null;
    title: string;
    description: string | null;
    primary_cta_label: string | null;
    primary_cta_href: string | null;
    secondary_cta_label: string | null;
    secondary_cta_href: string | null;
    image_url: string | null;
    alt: string | null;
  } | null;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-full bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand)]/90 disabled:opacity-60">
      {pending ? "Saving..." : "Save hero"}
    </button>
  );
}

export default function HeroAdminPanel({ hero }: HeroAdminProps) {
  const router = useRouter();
  const [state, formAction] = useFormState(saveHero, initialState);

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
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Home hero</h1>
          <p className="text-sm text-slate-600">
            Edit the main hero section of the homepage. Changes will reflect on
            <span className="font-mono"> / </span> after a short cache refresh.
          </p>
        </div>
      </div>

      <form
        action={formAction}
        className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 space-y-4 shadow-sm">
        {/* Eyebrow + Title */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 md:col-span-1">
            <label className="text-xs font-medium text-slate-700">
              Eyebrow (small label)
            </label>
            <input
              name="eyebrow"
              defaultValue={hero?.eyebrow ?? ""}
              placeholder="Premium rugs in Gqeberha"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-slate-700">Title</label>
            <input
              name="title"
              defaultValue={hero?.title ?? ""}
              placeholder="Everything You Need, Right at Your Doorstep."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={hero?.description ?? ""}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        {/* Primary & Secondary CTA */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <p className="text-xs font-semibold text-slate-800">
              Primary CTA (main button)
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Label
              </label>
              <input
                name="primary_cta_label"
                defaultValue={hero?.primary_cta_label ?? ""}
                placeholder="Browse Gallery"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Link (href)
              </label>
              <input
                name="primary_cta_href"
                defaultValue={hero?.primary_cta_href ?? ""}
                placeholder="/gallery"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/40 p-3">
            <p className="text-xs font-semibold text-slate-800">
              Secondary CTA
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Label
              </label>
              <input
                name="secondary_cta_label"
                defaultValue={hero?.secondary_cta_label ?? ""}
                placeholder="Get a quote"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">
                Link (href)
              </label>
              <input
                name="secondary_cta_href"
                defaultValue={hero?.secondary_cta_href ?? ""}
                placeholder="/about#contact"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
        </div>

        {/* Image + Alt */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Hero image URL
            </label>
            <input
              name="image_url"
              defaultValue={hero?.image_url ?? ""}
              placeholder="/og-image.png or https://..."
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
            <p className="text-[10px] text-slate-500">
              Can be a relative path in <code>/public</code> or a full Supabase
              Storage URL.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Image alt text (for accessibility & SEO)
            </label>
            <textarea
              name="alt"
              defaultValue={hero?.alt ?? ""}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <SaveButton />
          {state.message && (
            <p
              className={`text-[11px] ${
                state.ok ? "text-emerald-600" : "text-red-600"
              }`}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

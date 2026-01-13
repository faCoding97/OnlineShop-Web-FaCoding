"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  saveAboutContact,
  type AboutActionState,
} from "@/app/admin/about/actions";

type ContactData = {
  phone: string;
  whatsapp?: string | null;
  email: string;
  hours?: string | null;
  address: string;
  mapQuery: string;
  mapEmbedSrc: string;
};

type OrgData = {
  brandName: string;
  domain: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
};

const initialState: AboutActionState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--brand)]/90 disabled:opacity-60 disabled:cursor-not-allowed">
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}

export default function AboutAdminPanel({
  contact,
  org,
}: {
  contact: ContactData | null;
  org: OrgData | null;
}) {
  const [state, formAction] = useFormState(saveAboutContact, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          About & Contact
        </h1>
        <p className="text-sm text-slate-600">
          Update brand info, contact details, social links and Google Maps embed
          used on the About page.
        </p>
      </div>

      <form action={formAction} className="space-y-8 max-w-2xl">
        {/* Brand / Org */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Brand information
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Brand name
              </label>
              <input
                name="brandName"
                type="text"
                defaultValue={org?.brandName ?? "IVA"}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Domain (optional)
              </label>
              <input
                name="domain"
                type="text"
                placeholder="https://IVA.co.za"
                defaultValue={org?.domain ?? "https://IVA.co.za"}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
              <p className="text-[11px] text-slate-500">
                Used in SEO and structured data.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Instagram URL (optional)
              </label>
              <input
                name="instagramUrl"
                type="url"
                placeholder="https://instagram.com/IVAza"
                defaultValue={org?.instagramUrl ?? ""}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
              <p className="text-[11px] text-slate-500">
                Full Instagram profile URL, e.g. https://instagram.com/IVAza
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Facebook URL (optional)
              </label>
              <input
                name="facebookUrl"
                type="url"
                placeholder="https://facebook.com/IVAza"
                defaultValue={org?.facebookUrl ?? ""}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
              <p className="text-[11px] text-slate-500">
                Full Facebook page URL, e.g. https://facebook.com/IVAza
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Contact details
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Phone *
              </label>
              <input
                name="phone"
                type="text"
                defaultValue={contact?.phone ?? ""}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                WhatsApp (optional)
              </label>
              <input
                name="whatsapp"
                type="text"
                defaultValue={contact?.whatsapp ?? ""}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
              <p className="text-[11px] text-slate-500">
                Used to build the wa.me link on the About page.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Email *
            </label>
            <input
              name="email"
              type="email"
              defaultValue={contact?.email ?? ""}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Address *
            </label>
            <textarea
              name="address"
              rows={2}
              defaultValue={contact?.address ?? ""}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Opening hours (optional)
            </label>
            <input
              name="hours"
              type="text"
              defaultValue={contact?.hours ?? ""}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
          </div>
        </section>

        {/* Map */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900">Google Maps</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Map search query
            </label>
            <input
              name="mapQuery"
              type="text"
              defaultValue={contact?.mapQuery ?? "IVA, Klerksdorp"}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
            <p className="text-[11px] text-slate-500">
              Used for the "Open in Maps" link and for SEO context.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Map embed src
            </label>
            <textarea
              name="mapEmbedSrc"
              rows={3}
              defaultValue={contact?.mapEmbedSrc ?? ""}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
            />
            <p className="text-[11px] text-slate-500">
              Paste the URL from Google Maps embed (the src attribute of the
              iframe).
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <SubmitButton />
          {state.message && (
            <p
              className={`text-xs ${
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

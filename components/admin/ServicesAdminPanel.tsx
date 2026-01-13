"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createService,
  updateService,
  deleteService,
} from "@/app/admin/services/actions";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

type ServiceAdminItem = {
  id: string;
  title: string;
  description: string;
  from_price_zar: number | null;
  sort_order: number;
  bullets: string[];
};

function SaveButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-full bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand)]/90 disabled:opacity-60">
      {pending ? "Saving..." : label}
    </button>
  );
}

/** 🔹 فرم ساخت سرویس جدید */
function CreateServiceForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(createService, initialState);

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
      action={formAction}
      className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-900 mb-1">
        Add new service
      </h2>
      <p className="text-xs text-slate-600 mb-3">
        Define a service that appears on the public services page. Each line in
        the bullets field will be shown as a bullet point.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">ID</label>
          <input
            name="id"
            placeholder="rug-cleaning"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
          <p className="text-[10px] text-slate-500">
            Used internally in the database. Must be unique.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Title</label>
          <input
            name="title"
            placeholder="Professional Rug Cleaning"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            From price (ZAR)
          </label>
          <input
            name="from_price_zar"
            type="number"
            min={0}
            placeholder="450"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
          <p className="text-[10px] text-slate-500">
            Leave empty if you want "Contact for pricing".
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Sort order
          </label>
          <input
            name="sort_order"
            type="number"
            placeholder="1, 2, 3..."
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
          <p className="text-[10px] text-slate-500">
            Lower numbers appear first.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Bullets (one per line)
        </label>
        <textarea
          name="bullets"
          rows={4}
          placeholder={`Gentle, rug-specific cleaning methods\nCollection and delivery available in Gqeberha`}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <SaveButton label="Create service" />
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
  );
}

/** 🔹 فرم ویرایش هر سرویس */
function EditServiceForm({ service }: { service: ServiceAdminItem }) {
  const router = useRouter();
  const [state, formAction] = useFormState(updateService, initialState);

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
    if (!confirm(`Delete service "${service.title}"?`)) return;
    const res = await deleteService(service.id);
    if (res.ok) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
      <input type="hidden" name="id" value={service.id} />

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Title</label>
          <input
            name="title"
            defaultValue={service.title}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            From price (ZAR)
          </label>
          <input
            name="from_price_zar"
            type="number"
            min={0}
            defaultValue={service.from_price_zar ?? undefined}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Sort order
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={service.sort_order}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={service.description}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Bullets (one per line)
        </label>
        <textarea
          name="bullets"
          defaultValue={service.bullets.join("\n")}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
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
        <button
          type="button"
          onClick={handleDelete}
          className="group rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 hover:text-red-700 disabled:opacity-50">
          <svg
            className="h-4 w-4 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

/** 🔹 پنل اصلی Services */
export default function ServicesAdminPanel({
  services,
}: {
  services: ServiceAdminItem[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Services</h1>
          <p className="text-sm text-slate-600">
            Manage services shown on the public services page. Edit
            descriptions, prices and bullet points.
          </p>
        </div>
      </div>

      {/* فرم ساخت سرویس جدید */}
      <CreateServiceForm />

      {/* لیست سرویس‌های موجود */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-sm text-slate-600">
            No services yet. Add your first service above.
          </p>
        ) : (
          services.map((service) => (
            <EditServiceForm key={service.id} service={service} />
          ))
        )}
      </div>
    </div>
  );
}

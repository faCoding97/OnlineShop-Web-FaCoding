"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateFaqItem, createFaqItem } from "./actions";

const initialState = { ok: false, message: "" };

function SubmitButton({ label }: { label: string }) {
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

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="intent"
      value="delete"
      disabled={pending}
      className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60">
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
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

// فرم ویرایش + حذف برای هر آیتم
export function FAQForm({ item }: { item: any }) {
  const [state, formAction] = useFormState(updateFaqItem, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
      <input type="hidden" name="id" value={item.id} />

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Question</label>
        <input
          name="question"
          defaultValue={item.question}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Answer</label>
        <textarea
          name="answer"
          defaultValue={item.answer}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          {/* ذخیره/ویرایش */}
          <SubmitButton label="Save" />
          {/* حذف */}
          <DeleteButton />
        </div>

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

// فرم ساخت آیتم جدید
export function NewFAQForm() {
  const [state, formAction] = useFormState(createFaqItem, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      // بعد از ساخت موفق فرم خالی بشه
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 space-y-3 shadow-sm">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          New question
        </label>
        <input
          name="question"
          placeholder="Enter a new question..."
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Answer</label>
        <textarea
          name="answer"
          rows={3}
          placeholder="Enter the answer..."
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <SubmitButton label="Add FAQ" />
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

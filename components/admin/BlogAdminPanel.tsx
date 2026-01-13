// components/admin/BlogAdminPanel.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  saveBlogPost,
  deleteBlogPost,
  type ActionState,
} from "@/app/admin/blog/actions";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  content: string;
  tags: string[];
};

type Props = {
  posts: BlogPost[];
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-full bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand)]/90 disabled:opacity-60">
      {pending ? "Saving..." : "Save post"}
    </button>
  );
}

const initialState: ActionState = {
  ok: false,
  message: "",
};

export default function BlogAdminPanel({ posts }: Props) {
  const router = useRouter();
  const [state, formAction] = useFormState(saveBlogPost, initialState);
  const [selectedId, setSelectedId] = useState<string | null>(
    posts[0]?.id ?? null
  );
  const [isPending, startTransition] = useTransition();

  // 🔔 نوتیف بعد از ذخیره
  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      if (state.postId) {
        setSelectedId(state.postId);
      }
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const selectedPost = useMemo(
    () =>
      selectedId && selectedId !== "__new__"
        ? (posts.find((p) => p.id === selectedId) ?? null)
        : null,
    [posts, selectedId]
  );

  function handleDelete(id: string) {
    const title = posts.find((p) => p.id === id)?.title ?? "this post";
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    startTransition(async () => {
      const res = await deleteBlogPost(id);
      if (res.ok) {
        toast.success(res.message);
        router.refresh();

        // اگر پست انتخاب‌شده پاک شد، یکی دیگه رو انتخاب کن
        if (selectedId === id) {
          const remaining = posts.filter((p) => p.id !== id);
          setSelectedId(remaining[0]?.id ?? "__new__");
        }
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
      {/* سایدبار لیست پست‌ها */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Blog posts</h1>
            <p className="text-xs text-slate-600">
              Manage rug care articles and buying guides.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedId("__new__")}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50">
            + New post
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 max-h-[480px] overflow-y-auto">
          {posts.length === 0 ? (
            <p className="p-3 text-xs text-slate-500">
              No posts yet. Click “New post” to create one.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {posts.map((post) => {
                const isActive = selectedId === post.id;
                return (
                  <li
                    key={post.id}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-xs ${
                      isActive ? "bg-[var(--brand)]/5" : ""
                    }`}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(post.id)}
                      className="flex-1 text-left">
                      <p className="font-medium text-slate-900 line-clamp-1">
                        {post.title || "(Untitled)"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "en-ZA",
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              }
                            )
                          : "Draft"}
                        {post.tags?.length ? ` • ${post.tags.join(", ")}` : ""}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending}
                      className="group rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      title="Delete post">
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* فرم ویرایش / ایجاد */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">
            {selectedPost ? "Edit post" : "New post"}
          </p>
          {selectedPost && (
            <p className="text-[11px] text-slate-500">
              ID: <code className="font-mono">{selectedPost.id}</code>
            </p>
          )}
        </div>

        <form
          key={selectedId ?? "new"}
          action={formAction}
          className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 space-y-4 shadow-sm">
          {/* hidden id برای تشخیص create/update */}
          <input
            type="hidden"
            name="id"
            defaultValue={selectedPost?.id ?? ""}
          />

          {/* Title + Slug */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-slate-700">
                Title
              </label>
              <input
                name="title"
                defaultValue={selectedPost?.title ?? ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                placeholder="How to choose the right rug size for your lounge"
              />
            </div>
            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-medium text-slate-700">
                Slug (optional)
              </label>
              <input
                name="slug"
                defaultValue={selectedPost?.slug ?? ""}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                placeholder="how-to-choose-right-rug-size-lounge"
              />
              <p className="text-[10px] text-slate-500">
                If empty, it will be generated from the title.
              </p>
            </div>
          </div>

          {/* Published date */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Published date (optional)
            </label>
            <input
              type="date"
              name="published_at"
              defaultValue={
                selectedPost?.published_at
                  ? selectedPost.published_at.slice(0, 10)
                  : ""
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
            <p className="text-[10px] text-slate-500">
              If left blank, today will be saved as the publication date.
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Excerpt (short summary)
            </label>
            <textarea
              name="excerpt"
              defaultValue={selectedPost?.excerpt ?? ""}
              rows={2}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              defaultValue={selectedPost?.tags?.join(", ") ?? ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              placeholder="Sizing, Care"
            />
            <p className="text-[10px] text-slate-500">
              Tags are used for filtering and SEO. New tags are created
              automatically.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Content
            </label>
            <textarea
              name="content"
              defaultValue={selectedPost?.content ?? ""}
              rows={10}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              placeholder="Write the full article here..."
            />
          </div>

          <div className="flex items-center justify-between pt-1">
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
    </div>
  );
}

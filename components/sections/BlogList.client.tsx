// components/sections/BlogList.tsx
import Link from "next/link";

export type Post = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
};

type Props = {
  posts: Post[];
};

export default function BlogList({ posts }: Props) {
  if (!posts.length) {
    return (
      <p className="text-sm text-slate-500">
        No blog posts yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-slate-200 bg-white/80 p-4 hover:shadow-md transition-shadow">
          <Link href={`/blog/${post.id}`} className="block space-y-1">
            <h2 className="text-base font-semibold text-slate-900">
              {post.title}
            </h2>
            <p className="text-xs text-slate-500">
              {post.date}
              {post.tags?.length ? ` • ${post.tags.join(", ")}` : ""}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        </article>
      ))}
    </div>
  );
}

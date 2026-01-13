// app/blog/page.tsx
import { Container } from "@/components/ui/Container";
import Reveal from "@/components/widgets/Reveal.client";
import BlogList, { type Post } from "@/components/sections/BlogList.client";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const revalidate = 60; // ISR

// ردیف‌های خام از دیتابیس
type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string | null;
  content: string;
};

type TagRow = {
  id: number;
  name: string;
};

type PostTagRow = {
  post_id: string;
  tag_id: number;
};

export default async function BlogPage() {
  const supabase = createServerSupabaseAdminClient();

  // سه کوئری موازی: پست‌ها، تگ‌ها، لینک پست‑تگ
  const [postsRes, tagsRes, postTagsRes] = await Promise.all([
    supabase
      .from("site_blog_posts")
      .select("id, title, slug, published_at, excerpt, content")
      .order("published_at", { ascending: false }),
    supabase.from("site_blog_tags").select("id, name"),
    supabase.from("site_blog_post_tags").select("post_id, tag_id"),
  ]);

  const postRows = (postsRes.data ?? []) as BlogPostRow[];
  const tagRows = (tagsRes.data ?? []) as TagRow[];
  const postTagRows = (postTagsRes.data ?? []) as PostTagRow[];

  // map تگ‌ها: id → name
  const tagById = new Map<number, string>();
  for (const tag of tagRows) {
    tagById.set(tag.id, tag.name);
  }

  // گروه کردن نام تگ‌ها بر اساس post_id
  const tagsByPostId: Record<string, string[]> = {};
  for (const link of postTagRows) {
    const tagName = tagById.get(link.tag_id);
    if (!tagName) continue;
    if (!tagsByPostId[link.post_id]) {
      tagsByPostId[link.post_id] = [];
    }
    tagsByPostId[link.post_id].push(tagName);
  }

  // 👇 اینجا دقیقا به type Post که BlogList می‌خواهد مپ می‌کنیم
  const posts: Post[] = postRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    date: row.published_at, // 🟢 همون فیلد ضروری date
    excerpt: row.excerpt ?? "", // اگر null بود، رشته‌ی خالی
    tags: tagsByPostId[row.id] ?? [], // لیست تگ‌ها
  }));

  return (
    <div className="py-16 md:py-20">
      <Container>
        <Reveal>
          <header className="max-w-3xl mb-8">
            <p className="text-sm font-medium tracking-wide text-[var(--brand)] uppercase mb-2">
              Blog
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Rug guides, care tips & inspiration.
            </h1>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              Articles about choosing the right rug size, caring for wool and
              Persian rugs, and styling ideas for real South African homes.
            </p>
          </header>
        </Reveal>

        <Reveal>
          {/* الان type دقیقا همونه که BlogList می‌خواد */}
          <BlogList posts={posts} />
        </Reveal>
      </Container>
    </div>
  );
}

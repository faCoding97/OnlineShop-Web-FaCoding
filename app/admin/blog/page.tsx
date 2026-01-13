// app/admin/blog/page.tsx
import AdminGate from "@/components/admin/AdminGate";
import BlogAdminPanel from "@/components/admin/BlogAdminPanel";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminBlogPage() {
  const supabase = createServerSupabaseAdminClient();

  const [postsRes, postTagsRes, tagsRes] = await Promise.all([
    supabase
      .from("site_blog_posts")
      .select("*")
      .order("published_at", { ascending: false }),
    supabase.from("site_blog_post_tags").select("post_id, tag_id"),
    supabase.from("site_blog_tags").select("id, name"),
  ]);

  if (postsRes.error) {
    console.error("AdminBlogPage site_blog_posts error:", postsRes.error);
  }
  if (postTagsRes.error) {
    console.error(
      "AdminBlogPage site_blog_post_tags error:",
      postTagsRes.error
    );
  }
  if (tagsRes.error) {
    console.error("AdminBlogPage site_blog_tags error:", tagsRes.error);
  }

  const postsRows = (postsRes.data ?? []) as any[];
  const postTagsRows = (postTagsRes.data ?? []) as {
    post_id: string;
    tag_id: number;
  }[];
  const tagsRows = (tagsRes.data ?? []) as { id: number; name: string }[];

  // map: tag_id → name
  const tagById = new Map<number, string>();
  for (const row of tagsRows) {
    tagById.set(row.id, row.name);
  }

  // map: post_id → [tagName, ...]
  const tagsByPostId: Record<string, string[]> = {};
  for (const row of postTagsRows) {
    const tagName = tagById.get(row.tag_id);
    if (!tagName) continue;
    if (!tagsByPostId[row.post_id]) {
      tagsByPostId[row.post_id] = [];
    }
    tagsByPostId[row.post_id].push(tagName);
  }

  const posts = postsRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    published_at: row.published_at,
    excerpt: row.excerpt,
    content: row.content,
    tags: tagsByPostId[row.id] ?? [],
  }));

  return (
    <AdminGate>
      <BlogAdminPanel posts={posts} />
    </AdminGate>
  );
}

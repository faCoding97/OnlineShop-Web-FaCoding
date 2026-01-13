// app/admin/blog/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export type ActionState = {
  ok: boolean;
  message: string;
  postId?: string; // برای برگردوندن id پست جدید/آپدیت‌شده
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveBlogPost(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const idRaw = (formData.get("id") as string | null) ?? "";
    const existingId = idRaw.trim() || null;

    const title = ((formData.get("title") as string | null) ?? "").trim();
    const slugInput = ((formData.get("slug") as string | null) ?? "").trim();
    const excerpt = ((formData.get("excerpt") as string | null) ?? "").trim();
    const content = ((formData.get("content") as string | null) ?? "").trim();
    const publishedInput = (
      (formData.get("published_at") as string | null) ?? ""
    ).trim();
    const tagsInput =
      ((formData.get("tags") as string | null) ?? "").trim() || "";

    if (!title) {
      return { ok: false, message: "Title is required." };
    }

    // slug برای URL / SEO
    const slug = slugInput || slugify(title);

    // اگر تاریخ خالی بود، امروز
    const published_at = publishedInput
      ? new Date(publishedInput + "T00:00:00.000Z").toISOString()
      : new Date().toISOString();

    const tagNames = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const supabase = createServerSupabaseAdminClient();

    let postId: string;

    // --- ایجاد یا ویرایش پست ---
    if (existingId) {
      // UPDATE
      const { error } = await supabase
        .from("site_blog_posts")
        .update({
          title,
          slug,
          excerpt,
          content,
          published_at,
        })
        .eq("id", existingId);

      if (error) {
        console.error("Blog update error:", error.message);
        return { ok: false, message: "Error updating post." };
      }

      postId = existingId;
    } else {
      // CREATE → id حتماً باید به دیتابیس بدیم (ستون id text NOT NULL)
      const newId = slugify(title) || crypto.randomUUID();

      const { data, error } = await supabase
        .from("site_blog_posts")
        .insert([
          {
            id: newId,
            title,
            slug,
            excerpt,
            content,
            published_at,
          },
        ])
        .select("id")
        .single();

      if (error || !data) {
        if (error?.code === "23505") {
          // unique violation روی slug
          return {
            ok: false,
            message:
              "Slug already exists. Please change the slug or use a different title.",
          };
        }
        console.error("Blog create error:", error?.message);
        return { ok: false, message: "Error creating post." };
      }

      postId = data.id as string;
    }

    // --- مدیریت تگ‌ها ---
    // اول همه‌ی لینک‌های قبلی این پست رو پاک کن
    const { error: delLinksError } = await supabase
      .from("site_blog_post_tags")
      .delete()
      .eq("post_id", postId);

    if (delLinksError) {
      console.error("Delete old post_tags error:", delLinksError.message);
    }

    if (tagNames.length > 0) {
      // تگ‌های موجود
      const { data: existingTags, error: existingTagsError } = await supabase
        .from("site_blog_tags")
        .select("id, name")
        .in("name", tagNames);

      if (existingTagsError) {
        console.error("Fetch site_blog_tags error:", existingTagsError.message);
      }

      const existing = existingTags ?? [];
      const existingMap = new Map(existing.map((t) => [t.name, t.id]));

      const newTagNames = tagNames.filter((name) => !existingMap.has(name));

      let newTagsIds: number[] = [];
      if (newTagNames.length > 0) {
        const { data: inserted, error: insertTagsError } = await supabase
          .from("site_blog_tags")
          .insert(newTagNames.map((name) => ({ name })))
          .select("id, name");

        if (insertTagsError) {
          console.error("Insert new tags error:", insertTagsError.message);
        }

        newTagsIds = (inserted ?? []).map((t) => t.id as number);
      }

      const allTagIds: number[] = [
        ...existing.map((t) => t.id as number),
        ...newTagsIds,
      ];

      // لینک جدید پست/تگ‌ها
      if (allTagIds.length > 0) {
        const { error: linkError } = await supabase
          .from("site_blog_post_tags")
          .insert(
            allTagIds.map((tag_id) => ({
              post_id: postId,
              tag_id,
            }))
          );

        if (linkError) {
          console.error("Insert post_tags error:", linkError.message);
        }
      }
    }

    // revalidate صفحات
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${postId}`);

    return {
      ok: true,
      message: existingId
        ? "Post updated successfully."
        : "Post created successfully.",
      postId,
    };
  } catch (err) {
    console.error("saveBlogPost unexpected error:", err);
    return { ok: false, message: "Unexpected error. Please try again." };
  }
}

export async function deleteBlogPost(id: string): Promise<ActionState> {
  if (!id) return { ok: false, message: "Missing post id." };

  try {
    const supabase = createServerSupabaseAdminClient();

    // اول لینک‌های تگ‌ها
    const { error: delLinksError } = await supabase
      .from("site_blog_post_tags")
      .delete()
      .eq("post_id", id);

    if (delLinksError) {
      console.error("Delete post_tags error:", delLinksError.message);
    }

    // بعد خود پست
    const { error } = await supabase
      .from("site_blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete post error:", error.message);
      return { ok: false, message: "Error deleting post." };
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${id}`);

    return { ok: true, message: "Post deleted successfully." };
  } catch (err) {
    console.error("deleteBlogPost unexpected error:", err);
    return { ok: false, message: "Unexpected error. Please try again." };
  }
}

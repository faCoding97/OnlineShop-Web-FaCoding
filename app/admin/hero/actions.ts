"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

function revalidateHero() {
  // صفحه‌ی اصلی و پنل ادمین Hero دوباره بیلد/کش می‌شوند
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function saveHero(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = "home_hero"; // فعلاً فقط همین یکی داریم

  const eyebrow = (formData.get("eyebrow") as string | null)?.trim() || null;
  const title = (formData.get("title") as string | null)?.trim();
  const description =
    (formData.get("description") as string | null)?.trim() || null;

  const primary_cta_label =
    (formData.get("primary_cta_label") as string | null)?.trim() || null;
  const primary_cta_href =
    (formData.get("primary_cta_href") as string | null)?.trim() || null;

  const secondary_cta_label =
    (formData.get("secondary_cta_label") as string | null)?.trim() || null;
  const secondary_cta_href =
    (formData.get("secondary_cta_href") as string | null)?.trim() || null;

  const image_url =
    (formData.get("image_url") as string | null)?.trim() || null;
  const alt = (formData.get("alt") as string | null)?.trim() || null;

  if (!title) {
    return { ok: false, message: "Title is required." };
  }

  const supabase = createServerSupabaseAdminClient();

  const { error } = await supabase.from("site_hero").upsert(
    {
      id,
      eyebrow,
      title,
      description,
      primary_cta_label,
      primary_cta_href,
      secondary_cta_label,
      secondary_cta_href,
      image_url,
      alt,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("saveHero error:", error.message);
    return { ok: false, message: "Error saving hero content." };
  }

  revalidateHero();

  return { ok: true, message: "Hero content saved successfully." };
}

export { initialState };

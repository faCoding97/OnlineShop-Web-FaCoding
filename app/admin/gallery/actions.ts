"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";
import { Buffer } from "buffer";

type ActionState = {
  ok: boolean;
  message: string;
};

const BUCKET_NAME = "gallery";

/* ---------------------- 🔄 Revalidate Helper ---------------------- */
function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

/* ---------------------- 📤 Upload Helper ---------------------- */
async function uploadImage(file: File, itemId: string): Promise<string | null> {
  const supabase = createServerSupabaseAdminClient();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const path = `items/${itemId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl ?? null;
}

/* ---------------------- 🟢 CREATE ITEM ---------------------- */
export async function createGalleryItem(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = createServerSupabaseAdminClient();

  const id = (formData.get("id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const size = (formData.get("size") as string)?.trim();
  const dimensions = (formData.get("dimensions") as string)?.trim() || null;
  const material = (formData.get("material") as string)?.trim();
  const origin = (formData.get("origin") as string)?.trim() || null;
  const priceStr = (formData.get("price_zar") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const colorsCsv = (formData.get("colors") as string) ?? "";
  const badgesCsv = (formData.get("badges") as string) ?? "";
  const file = formData.get("image") as File | null;

  if (!id || !title || !category || !size || !material || !priceStr) {
    return { ok: false, message: "Please fill required fields." };
  }

  const price_zar = Number(priceStr);
  if (isNaN(price_zar)) {
    return { ok: false, message: "Price must be numeric." };
  }

  /* Upload image if exists */
  let image_url = "/og-image.png";
  if (file && file.size > 0) {
    const uploaded = await uploadImage(file, id);
    if (!uploaded) return { ok: false, message: "Image upload failed." };
    image_url = uploaded;
  }

  /* Insert main item row */
  const { error: insertError } = await supabase
    .from("site_gallery_items")
    .insert({
      id,
      title,
      category,
      size,
      dimensions,
      material,
      origin,
      price_zar,
      description,
      image_url,
    });

  if (insertError) {
    console.error(insertError.message);
    return { ok: false, message: "Error creating item. ID may already exist." };
  }

  /* Insert colors */
  const colors = colorsCsv
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  if (colors.length > 0) {
    await supabase
      .from("site_gallery_colors")
      .insert(colors.map((c) => ({ item_id: id, color: c })));
  }

  /* Insert badges */
  const badges = badgesCsv
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  if (badges.length > 0) {
    await supabase
      .from("site_gallery_badges")
      .insert(badges.map((b) => ({ item_id: id, badge: b })));
  }

  revalidateAll();
  return { ok: true, message: "Gallery item created successfully." };
}

/* ---------------------- 🟡 UPDATE ITEM ---------------------- */
export async function updateGalleryItem(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = createServerSupabaseAdminClient();

  const id = (formData.get("id") as string)?.trim();
  if (!id) return { ok: false, message: "Missing item id." };

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const size = (formData.get("size") as string)?.trim();
  const dimensions = (formData.get("dimensions") as string)?.trim() || null;
  const material = (formData.get("material") as string)?.trim();
  const origin = (formData.get("origin") as string)?.trim() || null;
  const priceStr = (formData.get("price_zar") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || "";
  const colorsCsv = (formData.get("colors") as string) ?? "";
  const badgesCsv = (formData.get("badges") as string) ?? "";
  const existingImageUrl =
    (formData.get("existing_image_url") as string)?.trim() || null;
  const file = formData.get("image") as File | null;

  if (!title || !category || !size || !material || !priceStr) {
    return { ok: false, message: "Required fields missing." };
  }

  const price_zar = Number(priceStr);
  if (isNaN(price_zar)) return { ok: false, message: "Price must be numeric." };

  /* Upload new image if provided */
  let image_url = existingImageUrl;
  if (file && file.size > 0) {
    const uploaded = await uploadImage(file, id);
    if (!uploaded) return { ok: false, message: "Image upload failed." };
    image_url = uploaded;
  }

  /* Update main row */
  const { error: updateError } = await supabase
    .from("site_gallery_items")
    .update({
      title,
      category,
      size,
      dimensions,
      material,
      origin,
      price_zar,
      description,
      image_url,
    })
    .eq("id", id);

  if (updateError) {
    console.error(updateError.message);
    return { ok: false, message: "Error updating item." };
  }

  /* Refresh colors */
  const colors = colorsCsv
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  await supabase.from("site_gallery_colors").delete().eq("item_id", id);
  if (colors.length > 0) {
    await supabase
      .from("site_gallery_colors")
      .insert(colors.map((c) => ({ item_id: id, color: c })));
  }

  /* Refresh badges */
  const badges = badgesCsv
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  await supabase.from("site_gallery_badges").delete().eq("item_id", id);
  if (badges.length > 0) {
    await supabase
      .from("site_gallery_badges")
      .insert(badges.map((b) => ({ item_id: id, badge: b })));
  }

  revalidateAll();
  return { ok: true, message: "Gallery item updated." };
}

/* ---------------------- 🔴 DELETE ITEM ---------------------- */
export async function deleteGalleryItem(id: string): Promise<ActionState> {
  const supabase = createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("site_gallery_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error.message);
    return { ok: false, message: "Error deleting item." };
  }

  revalidateAll();
  return { ok: true, message: "Gallery item deleted." };
}

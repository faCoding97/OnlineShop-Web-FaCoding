// app/admin/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

// یه هِلپر برای تبدیل "Red, Navy, Ivory" → ["Red","Navy","Ivory"]
function parseCsv(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/* --------------------------------
   1) HERO
----------------------------------*/

export async function updateHero(formData: FormData) {
  const id = (formData.get("id") as string) || "home_hero";

  const payload = {
    eyebrow: ((formData.get("eyebrow") as string) || "").trim() || null,
    title: ((formData.get("title") as string) || "").trim(),
    description: ((formData.get("description") as string) || "").trim() || null,
    primary_cta_label:
      ((formData.get("primary_cta_label") as string) || "").trim() || null,
    primary_cta_href:
      ((formData.get("primary_cta_href") as string) || "").trim() || null,
    secondary_cta_label:
      ((formData.get("secondary_cta_label") as string) || "").trim() || null,
    secondary_cta_href:
      ((formData.get("secondary_cta_href") as string) || "").trim() || null,
    image_url: ((formData.get("image_url") as string) || "").trim() || null,
    alt: ((formData.get("alt") as string) || "").trim() || null,
  };

  const supabase = createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("site_hero")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("updateHero error:", error.message);
    throw new Error("Failed to update hero: " + error.message);
  }

  revalidatePath("/");
}

/* --------------------------------
   2) GALLERY – CREATE
----------------------------------*/

export async function createGalleryItem(formData: FormData) {
  const supabase = createServerSupabaseAdminClient();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const dimensions = String(formData.get("dimensions") || "").trim() || null;
  const material = String(formData.get("material") || "").trim();
  const origin = String(formData.get("origin") || "").trim() || null;
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  const priceZARRaw = String(formData.get("priceZAR") || "").trim();
  const priceZAR = priceZARRaw ? Number(priceZARRaw) : 0;

  if (!id) throw new Error("ID is required.");
  if (!title) throw new Error("Title is required.");
  if (!category) throw new Error("Category is required.");
  if (!size) throw new Error("Size is required.");
  if (!material) throw new Error("Material is required.");
  if (!description) throw new Error("Description is required.");
  if (!imageUrl) throw new Error("Image URL is required.");
  if (!Number.isFinite(priceZAR)) throw new Error("Price must be a number.");

  const colors = parseCsv(formData.get("colorsCsv"));
  const badges = parseCsv(formData.get("badgesCsv"));
  const galleryImages = parseCsv(formData.get("galleryCsv"));

  // ۱) خود آیتم اصلی
  const { error: itemError } = await supabase
    .from("site_gallery_items")
    .insert({
      id,
      title,
      category,
      size,
      dimensions,
      material,
      origin,
      price_zar: priceZAR,
      description,
      image_url: imageUrl,
    });

  if (itemError) {
    console.error("createGalleryItem → itemError:", itemError.message);
    throw new Error("Failed to create gallery item: " + itemError.message);
  }

  // ۲) رنگ‌ها
  if (colors.length) {
    const { error } = await supabase
      .from("site_gallery_colors")
      .insert(colors.map((color) => ({ item_id: id, color })));
    if (error) {
      console.error("createGalleryItem → colorsError:", error.message);
      throw new Error("Failed to save colors: " + error.message);
    }
  }

  // ۳) badges
  if (badges.length) {
    const { error } = await supabase
      .from("site_gallery_badges")
      .insert(badges.map((badge) => ({ item_id: id, badge })));
    if (error) {
      console.error("createGalleryItem → badgesError:", error.message);
      throw new Error("Failed to save badges: " + error.message);
    }
  }

  // ۴) تصاویر جزئیات
  if (galleryImages.length) {
    const { error } = await supabase.from("site_gallery_detail_images").insert(
      galleryImages.map((image_url) => ({
        item_id: id,
        image_url,
      }))
    );
    if (error) {
      console.error("createGalleryItem → detailsError:", error.message);
      throw new Error("Failed to save gallery images: " + error.message);
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

/* --------------------------------
   3) GALLERY – UPDATE
----------------------------------*/

export async function updateGalleryItem(formData: FormData) {
  const supabase = createServerSupabaseAdminClient();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing item id.");

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const dimensions = String(formData.get("dimensions") || "").trim() || null;
  const material = String(formData.get("material") || "").trim();
  const origin = String(formData.get("origin") || "").trim() || null;
  const description = String(formData.get("description") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  const priceZARRaw = String(formData.get("priceZAR") || "").trim();
  const priceZAR = priceZARRaw ? Number(priceZARRaw) : 0;

  if (!title) throw new Error("Title is required.");
  if (!category) throw new Error("Category is required.");
  if (!size) throw new Error("Size is required.");
  if (!material) throw new Error("Material is required.");
  if (!description) throw new Error("Description is required.");
  if (!imageUrl) throw new Error("Image URL is required.");
  if (!Number.isFinite(priceZAR)) throw new Error("Price must be a number.");

  const colors = parseCsv(formData.get("colorsCsv"));
  const badges = parseCsv(formData.get("badgesCsv"));
  const galleryImages = parseCsv(formData.get("galleryCsv"));

  // ۱) آپدیت آیتم اصلی
  const { error: updateError } = await supabase
    .from("site_gallery_items")
    .update({
      title,
      category,
      size,
      dimensions,
      material,
      origin,
      price_zar: priceZAR,
      description,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (updateError) {
    console.error("updateGalleryItem → itemError:", updateError.message);
    throw new Error("Failed to update gallery item: " + updateError.message);
  }

  // ۲) پاک کردن قبلی‌ها و درج جدید (colors, badges, gallery images)
  await supabase.from("site_gallery_colors").delete().eq("item_id", id);
  await supabase.from("site_gallery_badges").delete().eq("item_id", id);
  await supabase.from("site_gallery_detail_images").delete().eq("item_id", id);

  if (colors.length) {
    const { error } = await supabase
      .from("site_gallery_colors")
      .insert(colors.map((color) => ({ item_id: id, color })));
    if (error) {
      console.error("updateGalleryItem → colorsError:", error.message);
      throw new Error("Failed to save colors: " + error.message);
    }
  }

  if (badges.length) {
    const { error } = await supabase
      .from("site_gallery_badges")
      .insert(badges.map((badge) => ({ item_id: id, badge })));
    if (error) {
      console.error("updateGalleryItem → badgesError:", error.message);
      throw new Error("Failed to save badges: " + error.message);
    }
  }

  if (galleryImages.length) {
    const { error } = await supabase.from("site_gallery_detail_images").insert(
      galleryImages.map((image_url) => ({
        item_id: id,
        image_url,
      }))
    );
    if (error) {
      console.error("updateGalleryItem → detailsError:", error.message);
      throw new Error("Failed to save gallery images: " + error.message);
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

/* --------------------------------
   4) GALLERY – DELETE
----------------------------------*/

export async function deleteGalleryItem(formData: FormData) {
  const supabase = createServerSupabaseAdminClient();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing item id.");

  const { error } = await supabase
    .from("site_gallery_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteGalleryItem error:", error.message);
    throw new Error("Failed to delete gallery item: " + error.message);
  }

  // بقیه جدول‌ها on delete cascade هستند
  revalidatePath("/gallery");
  revalidatePath("/");
  revalidatePath("/admin/gallery");
}

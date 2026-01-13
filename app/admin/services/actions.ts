"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

function revalidateServices() {
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

/** 🟢 ساخت سرویس جدید */
export async function createService(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = (formData.get("id") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const fromPriceStr = (
    formData.get("from_price_zar") as string | null
  )?.trim();
  const sortOrderStr = (formData.get("sort_order") as string | null)?.trim();
  const bulletsRaw = (formData.get("bullets") as string | null) ?? "";

  if (!id || !title || !description) {
    return { ok: false, message: "Please fill id, title and description." };
  }

  const from_price_zar = fromPriceStr ? Number(fromPriceStr) : null;

  if (fromPriceStr && Number.isNaN(from_price_zar)) {
    return { ok: false, message: "From price must be a number." };
  }

  const sort_order =
    sortOrderStr && !Number.isNaN(Number(sortOrderStr))
      ? Number(sortOrderStr)
      : 0;

  const supabase = createServerSupabaseAdminClient();

  // 👇 اینسرت سرویس
  const { error: insertError } = await supabase.from("site_services").insert({
    id,
    title,
    description,
    from_price_zar,
    sort_order,
  });

  if (insertError) {
    console.error("Create service error:", insertError.message);
    return {
      ok: false,
      message: "Error creating service (maybe id already exists).",
    };
  }

  // 👇 bullets (هر خط یک bullet)
  const bullets = bulletsRaw
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  if (bullets.length > 0) {
    const { error: bulletsError } = await supabase
      .from("site_service_bullets")
      .insert(bullets.map((b) => ({ service_id: id, bullet: b })));

    if (bulletsError) {
      console.error("Insert bullets error:", bulletsError.message);
      // سرویس ساخته شده، فقط bullets مشکل داشته – سایت نمی‌ترکه
    }
  }

  revalidateServices();
  return { ok: true, message: "Service created successfully." };
}

/** 🟡 آپدیت سرویس */
export async function updateService(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = (formData.get("id") as string | null)?.trim();
  if (!id) {
    return { ok: false, message: "Missing service id." };
  }

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const fromPriceStr = (
    formData.get("from_price_zar") as string | null
  )?.trim();
  const sortOrderStr = (formData.get("sort_order") as string | null)?.trim();
  const bulletsRaw = (formData.get("bullets") as string | null) ?? "";

  if (!title || !description) {
    return { ok: false, message: "Please fill title and description." };
  }

  const from_price_zar = fromPriceStr ? Number(fromPriceStr) : null;

  if (fromPriceStr && Number.isNaN(from_price_zar)) {
    return { ok: false, message: "From price must be a number." };
  }

  const sort_order =
    sortOrderStr && !Number.isNaN(Number(sortOrderStr))
      ? Number(sortOrderStr)
      : 0;

  const supabase = createServerSupabaseAdminClient();

  const { error: updateError } = await supabase
    .from("site_services")
    .update({
      title,
      description,
      from_price_zar,
      sort_order,
    })
    .eq("id", id);

  if (updateError) {
    console.error("Update service error:", updateError.message);
    return { ok: false, message: "Error updating service." };
  }

  // 👇 bullets: پاک کردن قبلی‌ها و اینسرت جدید
  const bullets = bulletsRaw
    .split("\n")
    .map((b) => b.trim())
    .filter(Boolean);

  await supabase.from("site_service_bullets").delete().eq("service_id", id);

  if (bullets.length > 0) {
    const { error: bulletsError } = await supabase
      .from("site_service_bullets")
      .insert(bullets.map((b) => ({ service_id: id, bullet: b })));

    if (bulletsError) {
      console.error("Update bullets error:", bulletsError.message);
    }
  }

  revalidateServices();
  return { ok: true, message: "Service updated." };
}

/** 🔴 حذف سرویس */
export async function deleteService(id: string): Promise<ActionState> {
  const supabase = createServerSupabaseAdminClient();

  const { error } = await supabase.from("site_services").delete().eq("id", id);

  if (error) {
    console.error("Delete service error:", error.message);
    return { ok: false, message: "Error deleting service." };
  }

  // به خاطر ON DELETE CASCADE، bullets هم خودکار حذف می‌شن
  revalidateServices();
  return { ok: true, message: "Service deleted." };
}

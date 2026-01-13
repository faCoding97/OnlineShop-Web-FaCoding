// app/admin/faq/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

type ActionState = { ok: boolean; message: string };

// ویرایش / حذف
export async function updateFaqItem(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const intent = (formData.get("intent") as string | null) ?? "update"; // "update" | "delete"
  const id = formData.get("id");

  if (!id) {
    return { ok: false, message: "Missing FAQ id." };
  }

  const supabase = createServerSupabaseAdminClient();

  if (intent === "delete") {
    const { error } = await supabase.from("site_faq").delete().eq("id", id);

    if (error) {
      console.error("FAQ delete error:", error.message);
      return { ok: false, message: "Error deleting FAQ. Please try again." };
    }

    revalidatePath("/");
    revalidatePath("/admin/faq");

    return { ok: true, message: "FAQ deleted successfully." };
  }

  // حالت عادی: ویرایش
  const question = (formData.get("question") as string) ?? "";
  const answer = (formData.get("answer") as string) ?? "";

  const { error } = await supabase
    .from("site_faq")
    .update({ question, answer })
    .eq("id", id);

  if (error) {
    console.error("FAQ update error:", error.message);
    return { ok: false, message: "Error saving FAQ. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/faq");

  return { ok: true, message: "FAQ updated successfully." };
}

// ساخت آیتم جدید
export async function createFaqItem(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const question = (formData.get("question") as string) ?? "";
  const answer = (formData.get("answer") as string) ?? "";

  if (!question.trim() || !answer.trim()) {
    return { ok: false, message: "Question and answer are required." };
  }

  const supabase = createServerSupabaseAdminClient();

  const { error } = await supabase
    .from("site_faq")
    .insert({ question, answer });

  if (error) {
    console.error("FAQ create error:", error.message);
    return { ok: false, message: "Error creating FAQ. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/faq");

  return { ok: true, message: "FAQ created successfully." };
}

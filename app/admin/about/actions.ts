"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export type AboutActionState = {
  ok: boolean;
  message: string;
};

export async function saveAboutContact(
  prevState: AboutActionState,
  formData: FormData
): Promise<AboutActionState> {
  const brandName = (formData.get("brandName") as string | null)?.trim() || "";
  const domain = (formData.get("domain") as string | null)?.trim() || "";

  const phone = (formData.get("phone") as string | null)?.trim() || "";
  const whatsapp = (formData.get("whatsapp") as string | null)?.trim() || "";
  const email = (formData.get("email") as string | null)?.trim() || "";
  const address = (formData.get("address") as string | null)?.trim() || "";
  const hours = (formData.get("hours") as string | null)?.trim() || "";
  const mapQuery = (formData.get("mapQuery") as string | null)?.trim() || "";
  const mapEmbedSrc =
    (formData.get("mapEmbedSrc") as string | null)?.trim() || "";

  const instagramUrl =
    (formData.get("instagramUrl") as string | null)?.trim() || "";
  const facebookUrl =
    (formData.get("facebookUrl") as string | null)?.trim() || "";

  if (!brandName) {
    return { ok: false, message: "Brand name is required." };
  }
  if (!phone) {
    return { ok: false, message: "Phone number is required." };
  }
  if (!email) {
    return { ok: false, message: "Email is required." };
  }
  if (!address) {
    return { ok: false, message: "Address is required." };
  }

  const supabase = createServerSupabaseAdminClient();

  // site_org
  const { error: orgError } = await supabase.from("site_org").upsert(
    [
      {
        id: "default",
        brand_name: brandName,
        domain: domain || "https://IVA.co.za",
      },
    ],
    { onConflict: "id" }
  );

  if (orgError) {
    console.error("saveAboutContact org error:", orgError.message);
    return { ok: false, message: "Error saving brand info." };
  }

  // site_contact
  const { error: contactError } = await supabase.from("site_contact").upsert(
    [
      {
        id: "default",
        phone,
        whatsapp: whatsapp || null,
        email,
        hours: hours || null,
        address,
        map_query: mapQuery || "IVA, Klerksdorp",
        map_embed_src:
          mapEmbedSrc || "https://www.google.com/maps/embed?pb=...",
      },
    ],
    { onConflict: "id" }
  );

  if (contactError) {
    console.error("saveAboutContact contact error:", contactError.message);
    return { ok: false, message: "Error saving contact info." };
  }

  // 🔹 site_org_social (instagram + facebook)
  // اول رکوردهای قبلی این دو پلتفرم رو پاک می‌کنیم که دابل نشه
  const { error: socialDeleteError } = await supabase
    .from("site_org_social")
    .delete()
    .eq("org_id", "default")
    .in("platform", ["instagram", "facebook"]);

  if (socialDeleteError) {
    console.error(
      "saveAboutContact social delete error:",
      socialDeleteError.message
    );
    return { ok: false, message: "Error updating social links (delete)." };
  }

  const socialRows: { org_id: string; platform: string; url: string }[] = [];

  if (instagramUrl) {
    socialRows.push({
      org_id: "default",
      platform: "instagram",
      url: instagramUrl,
    });
  }

  if (facebookUrl) {
    socialRows.push({
      org_id: "default",
      platform: "facebook",
      url: facebookUrl,
    });
  }

  if (socialRows.length > 0) {
    const { error: socialInsertError } = await supabase
      .from("site_org_social")
      .insert(socialRows);

    if (socialInsertError) {
      console.error(
        "saveAboutContact social insert error:",
        socialInsertError.message
      );
      return { ok: false, message: "Error saving social links." };
    }
  }

  // revalidate
  revalidatePath("/about");
  revalidatePath("/");
  // اگر فوتر تو صفحات دیگه هم مهمه، می‌تونی revalidatePath("/services") و ... هم اضافه کنی

  return {
    ok: true,
    message: "About, contact & social info updated.",
  };
}

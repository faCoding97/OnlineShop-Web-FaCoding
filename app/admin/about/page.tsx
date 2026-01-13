// app/admin/about/page.tsx
import AdminGate from "@/components/admin/AdminGate";
import AboutAdminPanel from "@/components/admin/AboutAdminPanel";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminAboutPage() {
  const supabase = createServerSupabaseAdminClient();

  const [contactRes, orgRes, socialRes] = await Promise.all([
    supabase.from("site_contact").select("*").single(),
    supabase.from("site_org").select("*").single(),
    supabase.from("site_org_social").select("*").eq("org_id", "default"),
  ]);

  if (contactRes.error) {
    console.error("AdminAboutPage site_contact error:", contactRes.error);
  }
  if (orgRes.error) {
    console.error("AdminAboutPage site_org error:", orgRes.error);
  }
  if (socialRes.error) {
    console.error("AdminAboutPage site_org_social error:", socialRes.error);
  }

  const contactRow: any = contactRes.data;
  const orgRow: any = orgRes.data;
  const socialRows: any[] = socialRes.data ?? [];

  const contact = contactRow
    ? {
        phone: contactRow.phone,
        whatsapp: contactRow.whatsapp,
        email: contactRow.email,
        hours: contactRow.hours,
        address: contactRow.address,
        mapQuery: contactRow.map_query,
        mapEmbedSrc: contactRow.map_embed_src,
      }
    : null;

  const instagramRow = socialRows.find((row) => row.platform === "instagram");
  const facebookRow = socialRows.find((row) => row.platform === "facebook");

  const org = orgRow
    ? {
        brandName: orgRow.brand_name,
        domain: orgRow.domain,
        instagramUrl: instagramRow?.url ?? "",
        facebookUrl: facebookRow?.url ?? "",
      }
    : null;

  return (
    <AdminGate>
      <AboutAdminPanel contact={contact} org={org} />
    </AdminGate>
  );
}

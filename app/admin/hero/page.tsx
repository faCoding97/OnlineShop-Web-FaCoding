// app/admin/hero/page.tsx
import AdminGate from "@/components/admin/AdminGate";
import HeroAdminPanel from "@/components/admin/HeroAdminPanel";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type HeroRow = {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  alt: string | null;
};

export default async function AdminHeroPage() {
  const supabase = createServerSupabaseAdminClient();

  const { data, error } = await supabase
    .from("site_hero")
    .select(
      "id, eyebrow, title, description, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, image_url, alt"
    )
    .eq("id", "home_hero")
    .maybeSingle();

  if (error) {
    console.error("Fetch hero error:", error.message);
  }

  const hero = (data ?? null) as HeroRow | null;

  return (
    <AdminGate>
      <HeroAdminPanel hero={hero} />
    </AdminGate>
  );
}

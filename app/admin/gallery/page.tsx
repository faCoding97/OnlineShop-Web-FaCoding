import AdminGate from "@/components/admin/AdminGate";
import GalleryAdminPanel from "@/components/admin/GalleryAdminPanel";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminGalleryPage() {
  const supabase = createServerSupabaseAdminClient();

  const [itemsRes, colorsRes, badgesRes, detailsRes] = await Promise.all([
    supabase
      .from("site_gallery_items")
      .select(
        "id, title, category, size, dimensions, material, origin, price_zar, description, image_url, created_at"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("site_gallery_colors")
      .select("item_id, color")
      .order("id", { ascending: true }),

    supabase
      .from("site_gallery_badges")
      .select("item_id, badge")
      .order("id", { ascending: true }),

    supabase
      .from("site_gallery_detail_images")
      .select("item_id, image_url")
      .order("id", { ascending: true }),
  ]);

  const items = (itemsRes.data ?? []).map((row) => ({
    ...row,
    colors: (colorsRes.data ?? [])
      .filter((c) => c.item_id === row.id)
      .map((x) => x.color),
    badges: (badgesRes.data ?? [])
      .filter((b) => b.item_id === row.id)
      .map((x) => x.badge),
    gallery: (detailsRes.data ?? [])
      .filter((d) => d.item_id === row.id)
      .map((x) => x.image_url),
  }));

  return (
    <AdminGate>
      <GalleryAdminPanel items={items} />
    </AdminGate>
  );
}

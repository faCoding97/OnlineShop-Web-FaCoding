// app/gallery/page.tsx
import { Container } from "@/components/ui/Container";
import Reveal from "@/components/widgets/Reveal.client";
import GalleryPageClient from "@/components/sections/GalleryPageClient.client";
import { createServerSupabaseAdminClient } from "@/lib/supabase";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  size: string;
  dimensions?: string | null;
  material: string;
  origin?: string | null;
  colors?: string[]; // از جدول site_gallery_colors
  priceZAR: number; // از price_zar
  badges?: string[]; // از site_gallery_badges
  description: string;
  image: string; // از image_url
  gallery?: string[]; // از site_gallery_detail_images
};

export const revalidate = 60; // ISR هر ۶۰ ثانیه

export default async function GalleryPage() {
  const supabase = createServerSupabaseAdminClient();

  // 👇 سه کوئری موازی:
  const [itemsRes, colorsRes, badgesRes, detailsRes] = await Promise.all([
    supabase
      .from("site_gallery_items")
      .select(
        "id, title, category, size, dimensions, material, origin, price_zar, description, image_url"
      )
      .order("title", { ascending: true }), // چون sort_order نداریم، با title مرتب می‌کنیم
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

  if (itemsRes.error) {
    console.error("Error fetching gallery items:", itemsRes.error.message);
  }
  if (colorsRes.error) {
    console.error("Error fetching gallery colors:", colorsRes.error.message);
  }
  if (badgesRes.error) {
    console.error("Error fetching gallery badges:", badgesRes.error.message);
  }
  if (detailsRes.error) {
    console.error(
      "Error fetching gallery detail images:",
      detailsRes.error.message
    );
  }

  const rawItems = itemsRes.data ?? [];
  const rawColors = colorsRes.data ?? []; 
  const rawBadges = badgesRes.data ?? [];
  const rawDetails = detailsRes.data ?? [];

  // 🔁 گروپ کردن رنگ‌ها بر اساس item_id
  const colorsByItem: Record<string, string[]> = {};
  for (const row of rawColors as any[]) {
    if (!colorsByItem[row.item_id]) {
      colorsByItem[row.item_id] = [];
    }
    colorsByItem[row.item_id].push(row.color);
  }

  // 🔁 گروپ کردن بج‌ها بر اساس item_id
  const badgesByItem: Record<string, string[]> = {};
  for (const row of rawBadges as any[]) {
    if (!badgesByItem[row.item_id]) {
      badgesByItem[row.item_id] = [];
    }
    badgesByItem[row.item_id].push(row.badge);
  }

  // 🔁 گروپ کردن تصاویر جزئیات بر اساس item_id
  const galleryImagesByItem: Record<string, string[]> = {};
  for (const row of rawDetails as any[]) {
    if (!galleryImagesByItem[row.item_id]) {
      galleryImagesByItem[row.item_id] = [];
    }
    galleryImagesByItem[row.item_id].push(row.image_url);
  }

  // 🔁 مپ کردن ردیف‌های اصلی به ساختار مورد نیاز کامپوننت
  const gallery: GalleryItem[] = (rawItems as any[]).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    size: row.size,
    dimensions: row.dimensions,
    material: row.material,
    origin: row.origin,
    priceZAR: row.price_zar, // 👈 تبدیل به camelCase
    description: row.description,
    image: row.image_url, // 👈 تبدیل به نام قبلی
    colors: colorsByItem[row.id] ?? [],
    badges: badgesByItem[row.id] ?? [],
    gallery: galleryImagesByItem[row.id] ?? [],
  }));

  return (
    <div className="py-16 md:py-20">
      <Container>
        <Reveal>
          <header className="max-w-3xl mb-8">
            <p className="text-sm font-medium tracking-wide text-[var(--brand)] uppercase mb-2">
              Gallery
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Browse our curated rug collection.
            </h1>
            <p className="text-base md:text-lg text-slate-700 leading-relaxed">
              Use the search and filters to find rugs by size, style, colour and
              material. All prices are shown in rounded ZAR for transparency.
            </p>
          </header>
        </Reveal>
        <Reveal>
          <GalleryPageClient items={gallery} />
        </Reveal>
      </Container>
    </div>
  );
}

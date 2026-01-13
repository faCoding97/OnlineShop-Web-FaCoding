// app/gallery/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import Reveal from "@/components/widgets/Reveal.client";
import { createServerSupabaseAdminClient } from "@/lib/supabase";
import CopyLinkButton from "@/components/gallery/CopyLinkButton.client";

export const revalidate = 60; // ISR هر ۶۰ ثانیه

type PageProps = {
  params: {
    id: string; // همون id ردیف در site_gallery_items
  };
};

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  size: string;
  dimensions?: string | null;
  material: string;
  origin?: string | null;
  colors: string[];
  priceZAR: number;
  badges: string[];
  description: string;
  image: string;
  gallery: string[];
};

// -----------------
//  برای SSG / ISR
// -----------------
export async function generateStaticParams() {
  const supabase = createServerSupabaseAdminClient();

  const { data, error } = await supabase
    .from("site_gallery_items")
    .select("id");

  if (error || !data) {
    console.error("generateStaticParams gallery error:", error?.message);
    return [];
  }

  return data.map((row) => ({ id: row.id as string }));
}

// -----------------
//  متادیتا داینامیک
// -----------------
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseAdminClient();

  const { data } = await supabase
    .from("site_gallery_items")
    .select("title, category, description")
    .eq("id", params.id)
    .single();

  if (!data) {
    return {
      title: "Rug not found | IVA",
      description: "This rug could not be found in our gallery.",
    };
  }

  const title = `${data.title} | IVA gallery`;
  const description =
    data.description ??
    `Browse details of ${data.title} from the IVA rug gallery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://IVA.co.za/gallery/${params.id}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// -----------------
//  صفحه‌ی دیتیل
// -----------------
export default async function GalleryItemPage({ params }: PageProps) {
  const supabase = createServerSupabaseAdminClient();

  const [itemRes, colorsRes, badgesRes, detailsRes] = await Promise.all([
    supabase
      .from("site_gallery_items")
      .select(
        "id, title, category, size, dimensions, material, origin, price_zar, description, image_url"
      )
      .eq("id", params.id)
      .single(),
    supabase
      .from("site_gallery_colors")
      .select("color")
      .eq("item_id", params.id)
      .order("id", { ascending: true }),
    supabase
      .from("site_gallery_badges")
      .select("badge")
      .eq("item_id", params.id)
      .order("id", { ascending: true }),
    supabase
      .from("site_gallery_detail_images")
      .select("image_url")
      .eq("item_id", params.id)
      .order("id", { ascending: true }),
  ]);

  if (itemRes.error || !itemRes.data) {
    console.error("Gallery item not found:", itemRes.error?.message);
    notFound();
  }

  const base = itemRes.data as any;

  const item: GalleryItem = {
    id: base.id,
    title: base.title,
    category: base.category,
    size: base.size,
    dimensions: base.dimensions,
    material: base.material,
    origin: base.origin,
    priceZAR: base.price_zar,
    description: base.description,
    image: base.image_url,
    colors: (colorsRes.data ?? []).map((c: any) => c.color),
    badges: (badgesRes.data ?? []).map((b: any) => b.badge),
    gallery: (detailsRes.data ?? []).map((d: any) => d.image_url),
  };

  const allImages =
    item.gallery && item.gallery.length > 0
      ? [item.image, ...item.gallery]
      : [item.image];

  return (
    <div className="py-16 md:py-20">
      <Container>
        <Reveal>
          <div className="mb-6 text-sm">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
                ←
              </span>
              Back to gallery
            </a>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)] items-start">
            {/* تصاویر */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {allImages.map((src, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={src}
                        alt={`${item.title} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* اطلاعات محصول */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand)] mb-1">
                  {item.category}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {item.title}
                </h1>
                {item.badges.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-[11px] font-medium text-amber-800">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-2xl font-semibold text-slate-900">
                R {item.priceZAR.toLocaleString("en-ZA")}
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-700">
                <div>
                  <span className="font-semibold">Size:</span> {item.size}
                </div>
                {item.dimensions && (
                  <div>
                    <span className="font-semibold">Dimensions:</span>{" "}
                    {item.dimensions}
                  </div>
                )}
                <div>
                  <span className="font-semibold">Material:</span>{" "}
                  {item.material}
                </div>
                {item.origin && (
                  <div>
                    <span className="font-semibold">Origin:</span> {item.origin}
                  </div>
                )}
                {item.colors.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-semibold">Colours:</span>{" "}
                    {item.colors.join(", ")}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 mt-3 text-sm text-slate-700">
                <p className="mb-2">
                  To enquire about this rug, please send us a WhatsApp or email
                  with the link to this page or the product ID:
                  <code className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                    <CopyLinkButton />
                  </code>
                </p>
                <p>
                  We will confirm availability, delivery options and final
                  pricing in ZAR.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}

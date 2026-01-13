// app/page.tsx
import { createServerSupabaseAdminClient } from "@/lib/supabase";
import { Container } from "@/components/ui/Container";
import Hero from "@/components/sections/Hero";
import ValueProps from "@/components/sections/ValueProps";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/widgets/Reveal.client";

export const revalidate = 60; // ISR هر ۶۰ ثانیه

// 👇 تایپ‌های کمکی فقط برای خواناتر شدن
type FAQItem = {
  q: string;
  a: string;
};

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  size: string;
  dimensions?: string | null;
  material: string;
  origin?: string | null;
  priceZAR: number;
  description: string;
  image: string;
};

// اگر Hero کامپوننتت این اِسامی رو دارد:
type HeroData = {
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  image?: string | null;
  alt?: string | null;
};

type ContactData = {
  phone: string;
  whatsapp?: string | null;
  email: string;
  hours?: string | null;
  address: string;
  mapQuery: string;
  mapEmbedSrc: string;
};

export default async function HomePage() {
  const supabase = createServerSupabaseAdminClient();

  const [
    heroRes,
    valuePropsRes,
    featuresRes,
    testimonialsRes,
    faqRes,
    contactRes,
    galleryRes,
  ] = await Promise.all([
    // hero (یک ردیف)
    supabase.from("site_hero").select("*").single(),

    // value props
    supabase
      .from("site_value_props")
      .select("*")
      .order("sort_order", { ascending: true }),

    // features
    supabase
      .from("site_features")
      .select("*")
      .order("sort_order", { ascending: true }),

    // testimonials
    supabase
      .from("site_testimonials")
      .select("*")
      .order("sort_order", { ascending: true }),

    // FAQ
    supabase
      .from("site_faq")
      .select("*")
      .order("sort_order", { ascending: true }),

    // contact (یک ردیف)
    supabase.from("site_contact").select("*").single(),

    // gallery items برای Featured Deals
    // ⚠️ توجه: در اسکیما ستون sort_order برای گالری نداری،
    // پس روی title مرتب می‌کنیم (می‌تونی price_zar یا id هم بزنی)
    // gallery items برای Featured Deals
    supabase
      .from("site_gallery_items")
      .select(
        "id, title, category, size, dimensions, material, origin, price_zar, description, image_url"
      )
      .order("title", { ascending: true }),
  ]);

  // 🔍 اگر اروری بود، لاگ کن (کمک برای دیباگ)
  if (heroRes.error) console.error("site_hero error:", heroRes.error);
  if (valuePropsRes.error)
    console.error("site_value_props error:", valuePropsRes.error);
  if (featuresRes.error)
    console.error("site_features error:", featuresRes.error);
  if (testimonialsRes.error)
    console.error("site_testimonials error:", testimonialsRes.error);
  if (faqRes.error) console.error("site_faq error:", faqRes.error);
  if (contactRes.error) console.error("site_contact error:", contactRes.error);
  if (galleryRes.error)
    console.error("site_gallery_items error:", galleryRes.error);

  // ✅ ۱) Hero: مپ از snake_case → camelCase مطابق کامپوننت
  const heroRow: any = heroRes.data;
  const hero: HeroData | null = heroRow
    ? {
        eyebrow: heroRow.eyebrow,
        title: heroRow.title,
        description: heroRow.description,
        primaryCtaLabel: heroRow.primary_cta_label,
        primaryCtaHref: heroRow.primary_cta_href,
        secondaryCtaLabel: heroRow.secondary_cta_label,
        secondaryCtaHref: heroRow.secondary_cta_href,
        image: heroRow.image_url,
        alt: heroRow.alt,
      }
    : null;

  // ✅ ۲) Value props: اینجا اسم ستون‌ها با قبلی یکیه، نیاز به مپ خاصی نیست
  const valueProps = (valuePropsRes.data as any[]) ?? [];

  // ✅ ۳) Features: همین‌طور
  const features = (featuresRes.data as any[]) ?? [];

  // ✅ ۴) Testimonials: اسم فیلدها با JSON قبلی خیلی نزدیکه
  const testimonials = (testimonialsRes.data as any[]) ?? [];

  // ✅ ۵) FAQ: 🔴 اینجا مهمه — question/answer → q/a
  const faqRows = (faqRes.data as any[]) ?? [];
  const faq: FAQItem[] = faqRows.map((row) => ({
    q: row.question,
    a: row.answer,
  }));

  // ✅ ۶) Contact: snake_case → چیزی که CTA استفاده می‌کرد
  const contactRow: any = contactRes.data;
  const contact: ContactData | null = contactRow
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

  // ✅ ۷) Featured gallery: مپ کردن ستون‌های دیتابیس → ساختار قدیمی gallery.json
  const galleryRows = (galleryRes.data as any[]) ?? [];

  const featuredGallery: GalleryItem[] = galleryRows.slice(0, 8).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    size: row.size,
    dimensions: row.dimensions,
    material: row.material,
    origin: row.origin,
    priceZAR: row.price_zar,
    description: row.description,
    image: row.image_url,
  }));

  return (
    <>
      {/* Hero */}
      {hero && <Hero hero={hero} />}

      {/* Value props */}
      <section
        id="why-us"
        aria-labelledby="why-us-heading"
        className="anchor-section py-16 md:py-20">
        <Container>
          <Reveal>
            <ValueProps items={valueProps} />
          </Reveal>
        </Container>
      </section>

      {/* Featured gallery */}
      <section
        id="gallery"
        aria-labelledby="gallery-heading"
        className="anchor-section py-16 md:py-20 bg-white/80">
        <Container>
          <Reveal>
            <Features
              id="gallery-heading"
              title="Featured Deals"
              description="Hot picks and bestsellers updated daily. Browse the full store for thousands more."
              featuredGallery={featuredGallery}
            />
          </Reveal>
        </Container>
      </section>

      {/* Features (چرا با ما خرید کنید) */}
      <section
        aria-labelledby="features-heading"
        className="anchor-section py-16 md:py-20">
        <Container>
          <Reveal>
            <Features
              id="features-heading"
              title="Why shop with IVA?"
              description="We bring you endless variety, unbeatable prices, and services that make online shopping simple and stress-free."
              extraFeatures={features}
            />
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      <section
        aria-labelledby="testimonials-heading"
        className="anchor-section py-16 md:py-20 bg-white/80">
        <Container>
          <Reveal>
            <Testimonials
              id="testimonials-heading"
              title="What our customers say"
              items={testimonials}
            />
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="anchor-section py-16 md:py-20">
        <Container>
          <Reveal>
            <FAQ id="faq-heading" items={faq} />
          </Reveal>
        </Container>
      </section>

      {/* Contact / CTA */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="anchor-section py-16 md:py-20 bg-white/80">
        <Container>
          <Reveal>{contact && <CTA contact={contact} />}</Reveal>
        </Container>
      </section>
    </>
  );
}

// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header.client";
import Footer from "@/components/layout/Footer";
import { createServerSupabaseAdminClient } from "@/lib/supabase";
import ToastProvider from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://IVA.co.za"),
  title: {
    default: "IVA · Premium Rugs in Klerksdorp",
    template: "%s · IVA",
  },
  description:
    "IVA is a premium rug and carpet retailer in Klerksdorp, South Africa. Explore curated Persian, Oriental and modern rugs with local delivery.",
  openGraph: {
    title: "IVA · Premium Rugs in Klerksdorp",
    description:
      "Curated Persian, Oriental, kilim and modern rugs with expert advice and local delivery in Klerksdorp.",
    url: "https://IVA.co.za",
    siteName: "IVA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IVA showroom with premium rugs in Klerksdorp",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IVA · Premium Rugs in Klerksdorp",
    description:
      "Curated Persian, Oriental, kilim and modern rugs with expert advice and local delivery in Klerksdorp.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://IVA.co.za",
  },
  verification: {
    google: "Xke9sSoZGAxq3-aNsIJubc73vqJ_tLCh80nXg6mR0xs",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseAdminClient();

  const [themeRes, navRes, orgRes, contactRes, socialRes] = await Promise.all([
    // theme
    supabase.from("site_theme").select("*").single(),
    // nav
    supabase
      .from("site_nav_items")
      .select("*")
      .order("sort_order", { ascending: true }),
    // org
    supabase.from("site_org").select("*").single(),
    // contact
    supabase.from("site_contact").select("*").single(),
    // social links (instagram, facebook, ...)
    supabase.from("site_org_social").select("*").eq("org_id", "default"),
  ]);

  const theme = themeRes.data ?? {};
  const nav = navRes.data ?? [];
  const org = orgRes.data ?? null;
  const contact = contactRes.data ?? null;
  const socialLinks = (socialRes.data ?? []) as {
    platform: string;
    url: string;
  }[];

  return (
    <html lang="en">
      <body
        style={{
          ["--brand" as any]: theme.brand ?? "#ED1944",
          ["--accent" as any]: theme.accent ?? "#ED5A75",
          ["--bg" as any]: theme.bg ?? "#FAF7F2",
          ["--fg" as any]: theme.fg ?? "#0B1220",
        }}
        className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <ToastProvider />
        <Header nav={nav} />
        <main className="flex-1">{children}</main>
        <Footer org={org} contact={contact} socialLinks={socialLinks} />
      </body>
    </html>
  );
}

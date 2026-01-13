# IVA.co.za – Catalog-first rug store (frontend-only)

This is a **frontend-only**, production-ready Next.js 14 project for **IVA**, a premium rug and carpet retailer in **Klerksdorp , South Africa**.

The site is designed to be **ultra-simple, catalog-first and mobile friendly**, so customers can quickly browse rugs, filter by key attributes and request a quote.

---

## Tech stack

- **Next.js** `14.2.10` (App Router)
- **React** `18.3.1`
- **TypeScript** `5.x`
- **Tailwind CSS** `3.4.x`
- **qrcode.react** for QR code generation

All versions are **pinned** in `package.json` to avoid `ERESOLVE` issues.

> **Note:** Next.js may show a **“Next.js (14.2.10) is outdated”** warning. This is expected and can be safely ignored for this project.

---

## Navigation & routes

There are exactly **5 main navigation items**, with these labels and routes:

1. **Home** → `/`
2. **About & Contact** → `/about`
3. **Services** → `/services`
4. **Gallery** → `/gallery`
5. **Blog** → `/blog`

The header is **sticky**, mobile-friendly (hamburger menu), and uses large tap targets.

---

## Running the project

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

For a production build:

```bash
npm run build
npm start
```

---

## `.client.tsx` rule (hooks & events)

To keep a clean separation of client/server components:

- **Any component that uses React hooks** (`useState`, `useEffect`, etc.) **or browser-only APIs** must:
  - Live in its **own file** with the suffix `*.client.tsx`
  - Have **`"use client";` as the first line** of that file

Examples in this project:

- `components/layout/Header.client.tsx` (mobile menu, scroll state)
- `components/widgets/SearchBar.client.tsx`
- `components/widgets/FilterBar.client.tsx`
- `components/widgets/SortBar.client.tsx`
- `components/widgets/QrCode.client.tsx`
- `components/widgets/MapEmbed.client.tsx`
- `components/widgets/Reveal.client.tsx`
- `components/widgets/Modal.client.tsx`
- `components/widgets/Toast.client.tsx`
- `components/sections/GalleryPageClient.client.tsx`
- `components/sections/BlogList.client.tsx`

Route files in `/app` are **server components** and do **not** use hooks directly. They import client components where needed.

---

## Single source of truth: `data/site.json`

All core content, theme tokens and navigation are configured in:

```text
data/site.json
```

The shape matches this contract (simplified):

```ts
theme: { brand: string; accent: string; bg: string; fg: string };
layout: { containerMax: string; sectionY: string; heroHeight: string; cardAspect?: string };

nav: { label: "Home"|"About & Contact"|"Services"|"Gallery"|"Blog"; href: string }[];

hero: {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: string;
  alt?: string;
};

valueProps: { title: string; description: string; icon?: string }[];

features: { title: string; description: string }[];

gallery: {
  id: string;
  title: string;
  category: "Persian"|"Oriental"|"Kilim"|"Modern"|"Traditional"|"Shag"|string;
  size: "Small"|"Medium"|"Large"|"Runner"|string;
  dimensions?: string;
  material: "Wool"|"Silk"|"Cotton"|"Synthetic"|string;
  origin?: string;
  colors?: string[];
  priceZAR: number;
  badges?: string[];
  description: string;
  image: string;
  gallery?: string[];
}[];

services: {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  fromPriceZAR?: number;
  image?: string;
}[];

testimonials: { quote: string; name: string; role?: string; avatar?: string }[];

faq: { q: string; a: string }[];

contact: {
  phone: string;
  whatsapp?: string;
  email: string;
  hours?: string;
  address: string;
  mapQuery: string;
  mapEmbedSrc: string;
};

blog: {
  id: string;
  title: string;
  date: string; // ISO
  tags?: string[];
  excerpt: string;
  content: string;
}[];

routes: { galleryRoot: "/gallery"; servicesRoot: "/services"; blogRoot: "/blog" };

org: {
  brandName: "IVA";
  domain: "https://IVA.co.za";
  social?: {
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
  };
};
```

### What to edit in `data/site.json`

- **Theme** (`theme`): set brand colours and background/text colours.
  - Example default palette:
    - `brand: "#ED1944"` (walnut)
    - `accent: "#C19A6B"` (tan)
    - `bg: "#FAF7F2"`
    - `fg: "#0B1220"`
- **Layout** (`layout`): adjust basic sizing if needed.
- **Nav** (`nav`): keep labels and routes unchanged, but you can re-order if required.
- **Hero** (`hero`): homepage headline, body text and main hero image.
- **Value props** (`valueProps`): concise cards explaining what makes IVA different.
- **Features** (`features`): key service features (free delivery, cleaning, underlays, etc.).
- **Gallery** (`gallery`):
  - Add, remove or update items.
  - Ensure `priceZAR` is a **rounded ZAR number** (e.g. `18500` for `ZAR 18,500`).
  - Set `category`, `size`, `material`, `origin` and `colors` for better filtering.
  - Use relative `image` URLs under `/public` (e.g. `/images/rugs/my-rug.jpg`).
- **Services** (`services`):
  - Update titles, descriptions and `fromPriceZAR` where applicable.
- **Testimonials** (`testimonials`): client quotes with name and area.
- **FAQ** (`faq`): edit questions and answers about delivery, returns, care, trials, etc.
- **Contact** (`contact`):
  - Update phone, WhatsApp, email, hours and address.
  - `mapQuery` and `mapEmbedSrc` are used by the embedded Google Map.
- **Blog** (`blog`):
  - Add or edit posts; each post opens in a **modal** on `/blog`.
  - Keep `date` as ISO strings (e.g. `"2025-09-01"`).
- **Org** (`org`):
  - Brand name, domain and social links.

---

## Theming & CSS variables

Theme tokens are exposed as CSS variables on `<body>`:

- `--brand` – primary brand colour
- `--accent` – secondary accent
- `--bg` – page background
- `--fg` – main text colour

Use them via Tailwind **arbitrary values**, for example:

- `bg-[var(--bg)]`
- `text-[var(--fg)]`
- `bg-[var(--brand)]`
- `ring-[var(--accent)]`
- `border-[var(--brand)]/30` (tints using Tailwind opacity syntax)

Core base styles and the anchor offset for the sticky header are defined in `app/globals.css`.

---

## QR code & Map

### QR to Gallery

The **Hero** section shows a QR code that links directly to the **Gallery**:

- Component: `components/widgets/QrCode.client.tsx`
- Library: `qrcode.react`
- Current destination: `https://IVA.co.za/gallery`

The QR component also includes an optional “Download PNG” button that lets you save the QR code as a PNG for printing on labels or marketing material.

To change the destination, update the `value` prop in `components/sections/Hero.tsx`.

### MapEmbed

The **Map** component lives at:

```text
components/widgets/MapEmbed.client.tsx
```

It implements the required API:

- Props: `embedSrc`, `query`, `title?`, `className?`
- Buttons:
  - **Open in Maps** – opens Google Maps search for the `query`
  - **Directions from here** – uses browser geolocation (if allowed) to open directions

Responsive iframe styles and anchor offsets for the sticky header are in `app/globals.css`.

To update the location, change `contact.mapQuery` and `contact.mapEmbedSrc` in `data/site.json`.

---

## SEO essentials

- `metadataBase` is set to `https://IVA.co.za` in `app/layout.tsx`.
- Open Graph and Twitter metadata are configured using `og-image.png`.
- `app/robots.ts`:
  - Allows full crawling and points to `/sitemap.xml`.
- `app/sitemap.ts`:
  - Lists `/`, `/about`, `/services`, `/gallery`, `/blog` with `weekly` change frequency.
- `app/manifest.json`:
  - Uses `name` / `short_name = "IVA"`
  - `theme_color` matches the default `theme.brand` (`#ED1944`).
  - Includes references to app icons in `/public/icons`.

---

## Replacing favicon, logo and images

The project ships with **placeholder assets** in `/public`:

- `/public/favicon.ico`
- `/public/og-image.png`
- `/public/logo/logo.png`
- `/public/icons/icon-192.png`
- `/public/icons/icon-512.png`

To customise:

1. Replace `favicon.ico` with your own ICO (preferred size: 32×32).
2. Replace `logo/logo.png` with your logo (e.g. 128×128 or 256×256 PNG).
3. Replace `og-image.png` with a 1200×630 image showcasing the brand.
4. Replace or add rug images under `/public/images/rugs/` and update `data/site.json` paths.

Next.js will automatically serve files from `/public` at the same URL path.

---

## Lighthouse testing

To test Lighthouse scores:

1. Run the production build locally:

   ```bash
   npm run build
   npm start
   ```

2. Open `http://localhost:3000` in Chrome.
3. Open **DevTools → Lighthouse**.
4. Run audits for **Performance**, **Accessibility**, **Best Practices** and **SEO**.
5. Aim for scores of **≥ 90** across all categories by:
   - Compressing / optimising rug images.
   - Keeping copy concise and readable.
   - Checking colour contrast (brand vs background) if you modify the palette.
   - Ensuring all images have meaningful `alt` text.

---

## Notes

- This project is **frontend-only** and does not include a backend or CMS.
- All prices are displayed as **rounded ZAR** (e.g. `ZAR 18,500`) via the helper `formatPriceZAR` in `lib/utils.ts`.
- You can safely ignore the “Next.js outdated” warning produced by the pinned version.

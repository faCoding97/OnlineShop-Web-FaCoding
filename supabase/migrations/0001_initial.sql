-- 0001_initial.sql
-- اسکیمای محتوای سایت IVA روی Supabase

-------------------------
-- 1. جداول پایه
-------------------------

-- جدول ادمین‌ها (کاربرانی که اجازه ویرایش دارند)
create table if not exists site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique
);

-- تنظیمات تم
create table if not exists site_theme (
  id text primary key default 'default',
  brand text not null,
  accent text not null,
  bg text not null,
  fg text not null
);

-- تنظیمات layout
create table if not exists site_layout (
  id text primary key default 'default',
  container_max text not null,
  section_y text not null,
  hero_height text not null,
  card_aspect text
);

-- ناوبری
create table if not exists site_nav_items (
  id bigserial primary key,
  label text not null,
  href text not null,
  sort_order int not null default 0
);

-- Hero
create table if not exists site_hero (
  id text primary key default 'home_hero',
  eyebrow text,
  title text not null,
  description text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  image_url text,
  alt text
);

-- Value props
create table if not exists site_value_props (
  id bigserial primary key,
  title text not null,
  description text not null,
  icon text,
  sort_order int not null default 0
);

-- Features
create table if not exists site_features (
  id bigserial primary key,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- Gallery items
create table if not exists site_gallery_items (
  id text primary key,
  title text not null,
  category text not null,
  size text not null,
  dimensions text,
  material text not null,
  origin text,
  price_zar int not null,
  description text not null,
  image_url text not null,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- رنگ‌ها / رنگ‌های هر آیتم
create table if not exists site_gallery_colors (
  id bigserial primary key,
  item_id text not null references site_gallery_items(id) on delete cascade,
  color text not null
);

-- badges / برچسب‌ها
create table if not exists site_gallery_badges (
  id bigserial primary key,
  item_id text not null references site_gallery_items(id) on delete cascade,
  badge text not null
);

-- تصاویر جزئیات (گالری داخلی)
create table if not exists site_gallery_detail_images (
  id bigserial primary key,
  item_id text not null references site_gallery_items(id) on delete cascade,
  image_url text not null
);

-- Services
create table if not exists site_services (
  id text primary key,
  title text not null,
  description text not null,
  from_price_zar int,
  sort_order int not null default 0
);

create table if not exists site_service_bullets (
  id bigserial primary key,
  service_id text not null references site_services(id) on delete cascade,
  bullet text not null
);

-- Testimonials
create table if not exists site_testimonials (
  id bigserial primary key,
  quote text not null,
  name text not null,
  role text,
  avatar_url text,
  sort_order int not null default 0
);

-- FAQ
create table if not exists site_faq (
  id bigserial primary key,
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- Contact
create table if not exists site_contact (
  id text primary key default 'default',
  phone text not null,
  whatsapp text,
  email text not null,
  hours text,
  address text not null,
  map_query text not null,
  map_embed_src text not null
);

-- Blog
create table if not exists site_blog_posts (
  id text primary key,
  title text not null,
  slug text not null unique,
  published_at timestamptz not null,
  excerpt text not null,
  content text not null
);

create table if not exists site_blog_tags (
  id bigserial primary key,
  name text not null unique
);

create table if not exists site_blog_post_tags (
  post_id text not null references site_blog_posts(id) on delete cascade,
  tag_id bigint not null references site_blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Routes
create table if not exists site_routes (
  id text primary key default 'default',
  gallery_root text not null,
  services_root text not null,
  blog_root text not null
);

-- Org / سازمان
create table if not exists site_org (
  id text primary key default 'default',
  brand_name text not null,
  domain text not null
);

create table if not exists site_org_social (
  id bigserial primary key,
  org_id text not null references site_org(id) on delete cascade,
  platform text not null,
  url text not null
);

-------------------------
-- 2. RLS
-------------------------

alter table site_admins enable row level security;
alter table site_theme enable row level security;
alter table site_layout enable row level security;
alter table site_nav_items enable row level security;
alter table site_hero enable row level security;
alter table site_value_props enable row level security;
alter table site_features enable row level security;
alter table site_gallery_items enable row level security;
alter table site_gallery_colors enable row level security;
alter table site_gallery_badges enable row level security;
alter table site_gallery_detail_images enable row level security;
alter table site_services enable row level security;
alter table site_service_bullets enable row level security;
alter table site_testimonials enable row level security;
alter table site_faq enable row level security;
alter table site_contact enable row level security;
alter table site_blog_posts enable row level security;
alter table site_blog_tags enable row level security;
alter table site_blog_post_tags enable row level security;
alter table site_routes enable row level security;
alter table site_org enable row level security;
alter table site_org_social enable row level security;

-- همه بتوانند بخوانند (anon + authenticated)
create policy "Public read site_theme" on site_theme
for select using (true);

create policy "Public read site_layout" on site_layout
for select using (true);

create policy "Public read site_nav_items" on site_nav_items
for select using (true);

create policy "Public read site_hero" on site_hero
for select using (true);

create policy "Public read site_value_props" on site_value_props
for select using (true);

create policy "Public read site_features" on site_features
for select using (true);

create policy "Public read site_gallery_items" on site_gallery_items
for select using (true);

create policy "Public read site_gallery_colors" on site_gallery_colors
for select using (true);

create policy "Public read site_gallery_badges" on site_gallery_badges
for select using (true);

create policy "Public read site_gallery_detail_images" on site_gallery_detail_images
for select using (true);

create policy "Public read site_services" on site_services
for select using (true);

create policy "Public read site_service_bullets" on site_service_bullets
for select using (true);

create policy "Public read site_testimonials" on site_testimonials
for select using (true);

create policy "Public read site_faq" on site_faq
for select using (true);

create policy "Public read site_contact" on site_contact
for select using (true);

create policy "Public read site_blog_posts" on site_blog_posts
for select using (true);

create policy "Public read site_blog_tags" on site_blog_tags
for select using (true);

create policy "Public read site_blog_post_tags" on site_blog_post_tags
for select using (true);

create policy "Public read site_routes" on site_routes
for select using (true);

create policy "Public read site_org" on site_org
for select using (true);

create policy "Public read site_org_social" on site_org_social
for select using (true);

-- فقط ادمین‌ها (site_admins) بتوانند بنویسند
-- توجه: service_role همیشه RLS را bypass می‌کند، پس برای Server Actions از service_role استفاده می‌کنیم.
create policy "Admins write site_theme" on site_theme
for all to authenticated
using (exists (select 1 from site_admins sa where sa.user_id = auth.uid()))
with check (exists (select 1 from site_admins sa where sa.user_id = auth.uid()));

create policy "Admins write site_layout" on site_layout
for all to authenticated
using (exists (select 1 from site_admins sa where sa.user_id = auth.uid()))
with check (exists (select 1 from site_admins sa where sa.user_id = auth.uid()));

create policy "Admins write site_nav_items" on site_nav_items
for all to authenticated
using (exists (select 1 from site_admins sa where sa.user_id = auth.uid()))
with check (exists (select 1 from site_admins sa where sa.user_id = auth.uid()));

-- (اگر خواستی واقعاً از RLS برای ادمین‌ها استفاده کنی، برای بقیه جداول هم همین policy را تکرار کن.
-- ولی چون Server Actions با service_role کار می‌کنند، از نظر عملی همین‌قدر کافی است.)

-------------------------
-- 3. Seed اولیه از site.json
-------------------------

-- Theme
insert into site_theme (id, brand, accent, bg, fg)
values ('default', '#ED1944', '#C19A6B', '#FAF7F2', '#0B1220')
on conflict (id) do update set
  brand = excluded.brand,
  accent = excluded.accent,
  bg = excluded.bg,
  fg = excluded.fg;

-- Layout
insert into site_layout (id, container_max, section_y, hero_height, card_aspect)
values ('default', '1200px', '5rem', 'min(640px, 90vh)', '4/3')
on conflict (id) do update set
  container_max = excluded.container_max,
  section_y = excluded.section_y,
  hero_height = excluded.hero_height,
  card_aspect = excluded.card_aspect;

-- Nav
insert into site_nav_items (label, href, sort_order) values
  ('Home', '/', 1),
  ('About & Contact', '/about', 2),
  ('Services', '/services', 3),
  ('Gallery', '/gallery', 4),
  ('Blog', '/blog', 5);

-- Hero
insert into site_hero (
  id, eyebrow, title, description,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  image_url, alt
) values (
  'home_hero',
  'Premium rugs in Gqeberha',
  'Everything You Need, Right at Your Doorstep.',
  'Discover thousands of products across every category – from electronics and fashion to home essentials and more. Fast local delivery in Klerksdorp and reliable nationwide shipping.',
  'Browse Gallery', '/gallery',
  'Get a Quote', '/about#contact',
  '/og-image.png',
  'Living room in Gqeberha with a premium rug from IVA'
)
on conflict (id) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  description = excluded.description,
  primary_cta_label = excluded.primary_cta_label,
  primary_cta_href = excluded.primary_cta_href,
  secondary_cta_label = excluded.secondary_cta_label,
  secondary_cta_href = excluded.secondary_cta_href,
  image_url = excluded.image_url,
  alt = excluded.alt;

-- Value props
insert into site_value_props (title, description, icon, sort_order) values
  ('Massive Variety', 'Thousands of quality products from trusted brands and sellers.', 'check', 1),
  ('Local Roots', 'Proudly based in Klerksdorp, serving North West and beyond with fast, reliable service.', 'map', 2),
  ('Hassle-Free Shopping', 'Easy returns, secure payments, and buyer protection on every order.', 'home', 3);

-- Features
insert into site_features (title, description, sort_order) values
  ('Fast Local Delivery', 'Free or low-cost delivery in Klerksdorp and surrounding areas for qualifying orders.', 1),
  ('Customer Support', 'Friendly help from our Klerksdorp-based team whenever you need it.', 2),
  ('Flexible Options', 'Find the perfect fit for any need – with easy filtering, wishlists and quick checkout.', 3);

-- Gallery items
insert into site_gallery_items (
  id, title, category, size, dimensions,
  material, origin, price_zar, description, image_url
) values
  (
  'persian-classic-red',
  'Persian Classic Red',
  'Persian',
  'Large',
  '2.0 × 3.0 m',
  'Wool',
  'Iran',
  18500,
  'A richly detailed hand-knotted Persian rug with a deep red field and classic medallion design.',
  '/images/rugs/persian-classic-red.jpg'
),
  (
  'oriental-midnight',
  'Oriental Midnight',
  'Oriental',
  'Medium',
  '1.6 × 2.3 m',
  'Wool',
  'Turkey',
  9200,
  'Elegant oriental pattern in deep navy and gold, ideal for living rooms and dining areas.',
  '/images/rugs/oriental-midnight.jpg'
),
  (
  'kilim-geom',
  'Kilim Geometry',
  'Kilim',
  'Medium',
  '1.5 × 2.0 m',
  'Wool',
  'Morocco',
  7500,
  'Flatwoven kilim rug with warm geometric motifs that work beautifully in modern spaces.',
  '/images/rugs/kilim-geometry.jpg'
),
  (
  'modern-sand',
  'Modern Sand',
  'Modern',
  'Large',
  '2.0 × 3.0 m',
  'Synthetic',
  'Belgium',
  5800,
  'Soft, low-maintenance modern rug with subtle texture and a calm sandy palette.',
  '/images/rugs/modern-sand.jpg'
),
  (
  'modern-charcoal-lines',
  'Modern Charcoal Lines',
  'Modern',
  'Large',
  '2.4 × 3.4 m',
  'Synthetic',
  'Turkey',
  6900,
  'Striking linear pattern in charcoal and grey, perfect for contemporary open-plan spaces.',
  '/images/rugs/modern-charcoal-lines.jpg'
),
  (
  'traditional-cream-border',
  'Traditional Cream Border',
  'Traditional',
  'Medium',
  '1.6 × 2.3 m',
  'Synthetic',
  'India',
  5200,
  'Classic bordered rug in soft cream with rich accent colours, ideal for dining rooms.',
  '/images/rugs/traditional-cream-border.jpg'
),
  (
  'kilim-summer',
  'Kilim Summer Stripe',
  'Kilim',
  'Runner',
  '0.8 × 2.5 m',
  'Wool',
  'India',
  3400,
  'Colourful striped kilim runner for hallways, entrances and kitchen spaces.',
  '/images/rugs/kilim-summer-stripe.jpg'
),
  (
  'shag-cloud',
  'Shag Cloud White',
  'Shag',
  'Large',
  '2.0 × 3.0 m',
  'Synthetic',
  'China',
  4300,
  'Plush shag rug with a cloud-like feel underfoot, perfect for bedrooms and TV rooms.',
  '/images/rugs/shag-cloud-white.jpg'
),
  (
  'shag-oatmeal',
  'Shag Oatmeal',
  'Shag',
  'Medium',
  '1.6 × 2.3 m',
  'Synthetic',
  'China',
  3600,
  'Warm oatmeal shag rug that adds comfort and texture to smaller living spaces.',
  '/images/rugs/shag-oatmeal.jpg'
),
  (
  'persian-navy-medallion',
  'Persian Navy Medallion',
  'Persian',
  'Medium',
  '1.8 × 2.7 m',
  'Wool',
  'Iran',
  14900,
  'Traditional navy Persian rug with a central medallion and intricate floral borders.',
  '/images/rugs/persian-navy-medallion.jpg'
),
  (
  'oriental-smoke',
  'Oriental Smoke',
  'Oriental',
  'Small',
  '1.2 × 1.8 m',
  'Wool',
  'Pakistan',
  6700,
  'Subtle oriental design in smoke grey and blue tones, ideal as an accent rug.',
  '/images/rugs/oriental-smoke.jpg'
),
  (
  'modern-loft-ivory',
  'Modern Loft Ivory',
  'Modern',
  'Medium',
  '1.6 × 2.3 m',
  'Synthetic',
  'Belgium',
  5400,
  'Low-profile modern rug with a soft ivory base and subtle texture for minimalist spaces.',
  '/images/rugs/modern-loft-ivory.jpg'
),
  (
  'traditional-rust-medallion',
  'Traditional Rust Medallion',
  'Traditional',
  'Large',
  '2.0 × 3.0 m',
  'Synthetic',
  'Turkey',
  6100,
  'Warm rust-coloured rug with a bold medallion, great for open-plan living areas.',
  '/images/rugs/traditional-rust-medallion.jpg'
),
  (
  'runner-vintage-blue',
  'Vintage Blue Runner',
  'Traditional',
  'Runner',
  '0.8 × 3.0 m',
  'Synthetic',
  'Turkey',
  3200,
  'Vintage-look runner in soft blue and cream tones for hallways and entrances.',
  '/images/rugs/runner-vintage-blue.jpg'
),
  (
  'kilim-earthy-diamond',
  'Kilim Earthy Diamond',
  'Kilim',
  'Small',
  '1.2 × 1.8 m',
  'Wool',
  'Morocco',
  5800,
  'Earthy kilim with diamond motifs, ideal layered over larger neutral rugs.',
  '/images/rugs/kilim-earthy-diamond.jpg'
),
  (
  'modern-abstract-dune',
  'Modern Abstract Dune',
  'Modern',
  'Large',
  '2.4 × 3.4 m',
  'Synthetic',
  'Turkey',
  7200,
  'Abstract dune-inspired pattern that pairs well with neutral sofas and wooden floors.',
  '/images/rugs/modern-abstract-dune.jpg'
),
  (
  'shag-silver-mist',
  'Shag Silver Mist',
  'Shag',
  'Small',
  '1.2 × 1.8 m',
  'Synthetic',
  'China',
  2900,
  'Compact shag rug in a soft silver tone, great next to the bed or in reading corners.',
  '/images/rugs/shag-silver-mist.jpg'
),
  (
  'persian-village-rust',
  'Persian Village Rust',
  'Persian',
  'Small',
  '1.2 × 1.8 m',
  'Wool',
  'Iran',
  9800,
  'Character-filled village Persian rug with warm rust and navy tones.',
  '/images/rugs/persian-village-rust.jpg'
),
  (
  'outdoor-weave-stone',
  'Outdoor Weave Stone',
  'Modern',
  'Large',
  '2.0 × 3.0 m',
  'Synthetic',
  'Belgium',
  5100,
  'Durable flatweave rug suitable for patios, dining rooms and busy family spaces.',
  '/images/rugs/outdoor-weave-stone.jpg'
);

-- Gallery colors
insert into site_gallery_colors (item_id, color) values
  ('persian-classic-red', 'Red'),
  ('persian-classic-red', 'Navy'),
  ('persian-classic-red', 'Ivory'),
  ('oriental-midnight', 'Navy'),
  ('oriental-midnight', 'Gold'),
  ('oriental-midnight', 'Ivory'),
  ('kilim-geom', 'Terracotta'),
  ('kilim-geom', 'Cream'),
  ('kilim-geom', 'Charcoal'),
  ('modern-sand', 'Beige'),
  ('modern-sand', 'Sand'),
  ('modern-sand', 'Taupe'),
  ('modern-charcoal-lines', 'Charcoal'),
  ('modern-charcoal-lines', 'Grey'),
  ('traditional-cream-border', 'Cream'),
  ('traditional-cream-border', 'Burgundy'),
  ('traditional-cream-border', 'Green'),
  ('kilim-summer', 'Rust'),
  ('kilim-summer', 'Blue'),
  ('kilim-summer', 'Ivory'),
  ('shag-cloud', 'White'),
  ('shag-oatmeal', 'Oatmeal'),
  ('shag-oatmeal', 'Beige'),
  ('persian-navy-medallion', 'Navy'),
  ('persian-navy-medallion', 'Red'),
  ('persian-navy-medallion', 'Ivory'),
  ('oriental-smoke', 'Grey'),
  ('oriental-smoke', 'Blue'),
  ('modern-loft-ivory', 'Ivory'),
  ('modern-loft-ivory', 'Light Grey'),
  ('traditional-rust-medallion', 'Rust'),
  ('traditional-rust-medallion', 'Navy'),
  ('traditional-rust-medallion', 'Cream'),
  ('runner-vintage-blue', 'Blue'),
  ('runner-vintage-blue', 'Cream'),
  ('kilim-earthy-diamond', 'Brown'),
  ('kilim-earthy-diamond', 'Ivory'),
  ('kilim-earthy-diamond', 'Mustard'),
  ('modern-abstract-dune', 'Beige'),
  ('modern-abstract-dune', 'Grey'),
  ('modern-abstract-dune', 'Charcoal'),
  ('shag-silver-mist', 'Silver'),
  ('persian-village-rust', 'Rust'),
  ('persian-village-rust', 'Navy'),
  ('persian-village-rust', 'Cream'),
  ('outdoor-weave-stone', 'Stone'),
  ('outdoor-weave-stone', 'Grey');

-- Gallery badges
insert into site_gallery_badges (item_id, badge) values
  ('persian-classic-red', 'Hand-knotted'),
  ('persian-classic-red', 'Vintage'),
  ('oriental-midnight', 'Hand-knotted'),
  ('kilim-geom', 'Flatweave'),
  ('kilim-geom', 'New'),
  ('modern-sand', 'New'),
  ('modern-charcoal-lines', 'New'),
  ('modern-charcoal-lines', 'Best-seller'),
  ('traditional-cream-border', 'Easy-care'),
  ('kilim-summer', 'Flatweave'),
  ('shag-cloud', 'Soft-touch'),
  ('shag-oatmeal', 'Soft-touch'),
  ('persian-navy-medallion', 'Hand-knotted'),
  ('oriental-smoke', 'Hand-knotted'),
  ('modern-loft-ivory', 'New'),
  ('traditional-rust-medallion', 'Best-seller'),
  ('runner-vintage-blue', 'Vintage-look'),
  ('kilim-earthy-diamond', 'Flatweave'),
  ('modern-abstract-dune', 'New'),
  ('shag-silver-mist', 'Soft-touch'),
  ('persian-village-rust', 'Hand-knotted'),
  ('persian-village-rust', 'Vintage'),
  ('outdoor-weave-stone', 'Indoor/Outdoor');

-- Gallery detail images
insert into site_gallery_detail_images (item_id, image_url) values
  ('persian-classic-red', '/images/rugs/persian-classic-red-detail1.jpg'),
  ('persian-classic-red', '/images/rugs/persian-classic-red-detail2.jpg');

-- Services
insert into site_services (id, title, description, from_price_zar, sort_order) values
  (
    'rug-cleaning',
    'Professional Rug Cleaning',
    'Deep, fibre-safe cleaning for modern and traditional rugs.',
    450,
    1
  ),
  (
    'rug-repair-fringe',
    'Rug Repairs & Fringe Work',
    'Skilled repairs to help extend the life of your favourite rugs.',
    650,
    2
  ),
  (
    'custom-sizing-underlays',
    'Custom Sizing & Underlays',
    'Make your rug fit your room and stay safely in place.',
    350,
    3
  ),
  (
    'home-trial-consult',
    'Home Trial & Consultation',
    'See selected rugs in your own space before you decide.',
    null,
    4
  ),
  (
    'commercial-fit-outs',
    'Commercial & Hospitality Fit-outs',
    'Rug solutions for guesthouses, offices and hospitality spaces.',
    null,
    5
  );

-- Service bullets
insert into site_service_bullets (service_id, bullet) values
  ('rug-cleaning', 'Gentle, rug-specific cleaning methods'),
  ('rug-cleaning', 'Dust removal, stain treatment and rinsing'),
  ('rug-cleaning', 'Suitable for wool, synthetic and many natural fibres'),
  ('rug-cleaning', 'Collection and delivery available in Gqeberha'),
  ('rug-repair-fringe', 'Fringe repair and replacement'),
  ('rug-repair-fringe', 'Edge binding and securing loose ends'),
  ('rug-repair-fringe', 'Straightening curled corners where possible'),
  ('rug-repair-fringe', 'Assessment and quotation before work starts'),
  ('custom-sizing-underlays', 'Cut-to-size non-slip underlays'),
  ('custom-sizing-underlays', 'Advice on rug placement and proportions'),
  ('custom-sizing-underlays', 'Solutions for open-plan living and awkward spaces'),
  ('custom-sizing-underlays', 'Ideal for wooden, tiled and vinyl floors'),
  ('home-trial-consult', 'Shortlist rugs with our team'),
  ('home-trial-consult', 'We bring selected pieces to your home in Gqeberha'),
  ('home-trial-consult', 'Perfect for tricky sizes and colour decisions'),
  ('home-trial-consult', 'Available on selected stock – booking essential'),
  ('commercial-fit-outs', 'Product selection for your traffic levels and style'),
  ('commercial-fit-outs', 'On-site measurements in Gqeberha by arrangement'),
  ('commercial-fit-outs', 'Options for easy-care and stain-resistant rugs'),
  ('commercial-fit-outs', 'Co-ordination with your interior team where needed');

-- Testimonials
insert into site_testimonials (quote, name, role, sort_order) values
  (
    'Fast delivery and great selection – got everything I needed in one order!',
    'Lize M.',
    'Klerksdorp',
    1
  ),
  (
    'Super helpful team, easy returns and the best prices around.',
    'Thabo K.',
    'Orkney',
    2
  ),
  (
    'Hassle-free shopping, quick support and products arrived perfect.',
    'Karen P.',
    'Klerksdorp',
    3
  );

-- FAQ
insert into site_faq (question, answer, sort_order) values
  (
    'Do you deliver in Klerksdorp?',
    'Yes. We offer fast local delivery in Klerksdorp and surrounding areas. For other parts of South Africa, we use reliable couriers at competitive rates.',
    1
  ),
  (
    'Can I try a rug at home before I buy?',
    'On selected pieces we offer a home trial service in Gqeberha. We bring the rug to you, you view it in your space, and only purchase if you are happy.',
    2
  ),
  (
    'How do returns work?',
    'Most items can be returned within 30 days if unused and in original packaging. Contact us to arrange – quick and straightforward.',
    3
  ),
  (
    'How do I track my order?',
    'You ll get real-time tracking updates via email/SMS. Check your account dashboard anytime.',
    4
  ),
  (
    'What payment methods do you accept?',
    'We accept EFT, credit/debit cards, secure online payments, and more – safe and convenient.',
    5
  ),
  (
    'Do you have customer support?',
    'Yes. Our friendly team in Klerksdorp is here to help with any question via phone, WhatsApp or email.',
    6
  );

-- Contact
insert into site_contact (
  id, phone, whatsapp, email, hours,
  address, map_query, map_embed_src
) values (
  'default',
  '+27 81 000 0000',
  '+27 81 000 0000',
  'hello@IVA.co.za',
  'Mon–Fri 9:00–17:00, Sat 9:00–13:00',
  'IVA showroom, Klerksdorp, Eastern Cape, South Africa',
  'IVA, Klerksdorp',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.054899285729!2d25.6126775!3d-33.9608367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e7ad1f6b8a9c4a3%3A0x0000000000000000!2sGqeberha%20(Port%20Elizabeth)!5e0!3m2!1sen!2sza!4v1700000000000'
)
on conflict (id) do update set
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  hours = excluded.hours,
  address = excluded.address,
  map_query = excluded.map_query,
  map_embed_src = excluded.map_embed_src;

-- Blog tags
insert into site_blog_tags (name) values
  ('Sizing'),
  ('Living room'),
  ('Materials'),
  ('Care'),
  ('Stains')
on conflict (name) do nothing;

-- Blog posts
insert into site_blog_posts (id, title, slug, published_at, excerpt, content) values
  (
  'choose-right-size-lounge',
  'How to Choose the Right Rug Size for Your Lounge',
  'how-to-choose-right-rug-size-lounge',
  '2025-09-01T00:00:00+02:00',
  'Most living rooms in Gqeberha look better when the rug is larger than you think. Here is a simple way to get it right.',
  'One of the most common questions we receive is: "What size rug should I choose for my lounge?" As a starting point, aim for a rug that allows at least the front legs of your sofa and chairs to sit on the rug. This visually connects the furniture and makes the room feel bigger. If the space allows, a rug large enough for all lounge furniture legs to sit on top creates a luxurious, hotel-like feel. Avoid floating a small rug in the middle of the room with all furniture off the rug – this can make the space feel disconnected. When in doubt, size up and use a quality underlay to keep the rug safely in place.'
),
  (
  'wool-vs-synthetic',
  'Wool vs Synthetic Rugs: Which Is Better?',
  'wool-vs-synthetic-rugs',
  '2025-08-20T00:00:00+02:00',
  'Both wool and synthetic rugs have strengths. The best choice depends on where you will use the rug and how you live.',
  'Wool rugs are naturally resilient, flame-resistant and excellent at hiding soil, making them ideal for lounges and bedrooms. They can shed lightly at first, which is normal and usually settles with regular vacuuming. Synthetic rugs, on the other hand, are stain-resistant, budget-friendly and often lighter to move. For busy family homes, synthetic rugs are often a practical choice, especially in dining rooms, playrooms and rental properties. For long-term investment pieces, particularly in lower-traffic areas, wool or hand-knotted rugs are hard to beat.'
),
  (
  'vacuuming-tips',
  'Vacuuming Tips That Protect Your Rug',
  'vacuuming-tips-that-protect-your-rug',
  '2025-07-15T00:00:00+02:00',
  'Vacuuming correctly is one of the easiest ways to extend the life of your rug.',
  'Regular vacuuming lifts surface dirt before it works its way into the fibres. For wool and hand-knotted rugs, use suction only (no rotating brush) to avoid unnecessary wear. Vacuum in the direction of the pile where possible and avoid catching the fringes. If someone in your home has allergies, consider vacuuming the back of the rug from time to time as well and using a rug underlay to prevent dust from collecting underneath.'
),
  (
  'stain-first-aid',
  'Stain First-Aid for Spills on Rugs',
  'stain-first-aid-for-spills-on-rugs',
  '2025-06-10T00:00:00+02:00',
  'Quick action can make a big difference when something spills on your rug.',
  'The first rule of rug stain treatment is: never rub aggressively. Start by blotting up as much of the spill as possible with white paper towel or a clean cloth. For water-based spills such as juice or tea, apply a little lukewarm water and continue blotting. For more complex stains, contact us for advice before using strong off-the-shelf products. If you are unsure, it is usually safer to book a professional clean, especially for wool and hand-knotted rugs.'
)
on conflict (id) do nothing;

-- Blog post ↔ tags
insert into site_blog_post_tags (post_id, tag_id) values
  (
  'choose-right-size-lounge',
  (select id from site_blog_tags where name = 'Sizing' limit 1)
),
  (
  'choose-right-size-lounge',
  (select id from site_blog_tags where name = 'Living room' limit 1)
),
  (
  'wool-vs-synthetic',
  (select id from site_blog_tags where name = 'Materials' limit 1)
),
  (
  'vacuuming-tips',
  (select id from site_blog_tags where name = 'Care' limit 1)
),
  (
  'stain-first-aid',
  (select id from site_blog_tags where name = 'Care' limit 1)
),
  (
  'stain-first-aid',
  (select id from site_blog_tags where name = 'Stains' limit 1)
)
on conflict do nothing;

-- Routes
insert into site_routes (id, gallery_root, services_root, blog_root)
values ('default', '/gallery', '/services', '/blog')
on conflict (id) do update set
  gallery_root = excluded.gallery_root,
  services_root = excluded.services_root,
  blog_root = excluded.blog_root;

-- Org
insert into site_org (id, brand_name, domain)
values ('default', 'IVA', 'https://IVA.co.za')
on conflict (id) do update set
  brand_name = excluded.brand_name,
  domain = excluded.domain;

-- Org social links
insert into site_org_social (org_id, platform, url) values
  ('default', 'instagram', 'https://instagram.com/IVAza'),
  ('default', 'facebook', 'https://facebook.com/IVAza')
on conflict do nothing;

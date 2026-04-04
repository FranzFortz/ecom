-- =============================================================================
-- M-Zone Gadgets — seed data for Supabase SQL Editor
-- Run AFTER schema.sql (schema adds missing columns on old `products` tables).
-- Gadgets-only catalog; category slug matches src/features/products/constants.ts.
-- =============================================================================

-- Self-heal if an older `products` table had no `category` column (avoids 42703)
alter table public.products add column if not exists category text;

-- Drop legacy catalog rows from older multi-category seeds (wishlist cascades on product delete)
delete from public.products
where category is null or category <> 'gadgets';

delete from public.categories
where slug <> 'gadgets';

-- Single category
insert into public.categories (name, slug) values
  ('Gadgets', 'gadgets')
on conflict (slug) do update set
  name = excluded.name;

-- Apple-style phones & tablets (demo data; not affiliated with Apple)
insert into public.products (
  name,
  slug,
  description,
  price,
  compare_price,
  sku,
  stock,
  category,
  images,
  variants,
  is_featured
) values
(
  'iPhone 11',
  'iphone-11',
  '6.1" Liquid Retina LCD, A13 Bionic, dual camera. Demo listing.',
  24990.00,
  28990.00,
  'SKU-APL-IPH11',
  18,
  'gadgets',
  array['https://placehold.co/600x400/1c1917/a8a29e?text=iPhone+11'],
  '{"storage":["64GB","128GB","256GB"],"color":["Black","White","Green","Purple","Yellow","Red"]}'::jsonb,
  true
),
(
  'iPhone 11 Pro',
  'iphone-11-pro',
  '5.8" Super Retina XDR, A13 Bionic, triple camera system. Demo listing.',
  32990.00,
  36990.00,
  'SKU-APL-IPH11P',
  12,
  'gadgets',
  array['https://placehold.co/600x400/292524/a8a29e?text=iPhone+11+Pro'],
  '{"storage":["64GB","256GB","512GB"],"color":["Space Gray","Silver","Gold","Midnight Green"]}'::jsonb,
  true
),
(
  'iPhone 12',
  'iphone-12',
  '6.1" Super Retina XDR, A14 Bionic, 5G. Demo listing.',
  27990.00,
  null,
  'SKU-APL-IPH12',
  22,
  'gadgets',
  array['https://placehold.co/600x400/44403c/a8a29e?text=iPhone+12'],
  '{"storage":["64GB","128GB","256GB"],"color":["Black","White","Blue","Green","Red","Purple"]}'::jsonb,
  false
),
(
  'iPhone 13',
  'iphone-13',
  '6.1" Super Retina XDR, A15 Bionic, improved cameras. Demo listing.',
  31990.00,
  34990.00,
  'SKU-APL-IPH13',
  20,
  'gadgets',
  array['https://placehold.co/600x400/57534e/e7e5e4?text=iPhone+13'],
  '{"storage":["128GB","256GB","512GB"],"color":["Midnight","Starlight","Blue","Pink","Green","Red"]}'::jsonb,
  false
),
(
  'iPhone 14',
  'iphone-14',
  '6.1" Super Retina XDR, A15 Bionic, Photonic Engine. Demo listing.',
  35990.00,
  null,
  'SKU-APL-IPH14',
  16,
  'gadgets',
  array['https://placehold.co/600x400/78716c/e7e5e4?text=iPhone+14'],
  '{"storage":["128GB","256GB","512GB"],"color":["Midnight","Starlight","Blue","Purple","Yellow","Red"]}'::jsonb,
  false
),
(
  'iPhone 15',
  'iphone-15',
  '6.1" Dynamic Island, A16 Bionic, USB-C. Demo listing.',
  42990.00,
  45990.00,
  'SKU-APL-IPH15',
  24,
  'gadgets',
  array['https://placehold.co/600x400/0c0a09/e7e5e4?text=iPhone+15'],
  '{"storage":["128GB","256GB","512GB"],"color":["Black","Blue","Green","Yellow","Pink"]}'::jsonb,
  false
),
(
  'iPhone 16',
  'iphone-16',
  '6.1" display, A18 chip, Camera Control. Demo listing.',
  48990.00,
  null,
  'SKU-APL-IPH16',
  20,
  'gadgets',
  array['https://placehold.co/600x400/1c1917/fafaf9?text=iPhone+16'],
  '{"storage":["128GB","256GB","512GB"],"color":["Black","White","Pink","Teal","Ultramarine"]}'::jsonb,
  false
),
(
  'iPhone 17',
  'iphone-17',
  'Demo flagship lineup placeholder — check Apple for real specs when available.',
  54990.00,
  null,
  'SKU-APL-IPH17',
  14,
  'gadgets',
  array['https://placehold.co/600x400/171717/f5f5f4?text=iPhone+17'],
  '{"storage":["256GB","512GB"],"color":["Black","Silver","Blue"]}'::jsonb,
  false
),
(
  'iPhone 17 Pro',
  'iphone-17-pro',
  'Demo Pro model — advanced cameras and Pro display (placeholder; M-Zone Gadgets sample data).',
  64990.00,
  69990.00,
  'SKU-APL-IPH17P',
  10,
  'gadgets',
  array['https://placehold.co/600x400/0a0a0a/f5f5f4?text=iPhone+17+Pro'],
  '{"storage":["256GB","512GB","1TB"],"color":["Natural Titanium","Blue Titanium","White Titanium","Black Titanium"]}'::jsonb,
  true
),
(
  'iPad (9th generation)',
  'ipad-9th-generation',
  '10.2" Retina, A13 Bionic, Touch ID, Lightning. Great for school and streaming.',
  18990.00,
  20990.00,
  'SKU-APL-IPD9',
  30,
  'gadgets',
  array['https://placehold.co/600x400/44403c/e7e5e4?text=iPad+9'],
  '{"storage":["64GB","256GB"],"color":["Space Gray","Silver"]}'::jsonb,
  false
),
(
  'iPad (10th generation)',
  'ipad-10th-generation',
  '10.9" Liquid Retina, A14 Bionic, landscape front camera, USB-C.',
  26990.00,
  null,
  'SKU-APL-IPD10',
  25,
  'gadgets',
  array['https://placehold.co/600x400/57534e/f5f5f4?text=iPad+10'],
  '{"storage":["64GB","256GB"],"color":["Blue","Pink","Yellow","Silver"]}'::jsonb,
  true
),
(
  'iPad Air (M2)',
  'ipad-air-m2',
  '10.9" Liquid Retina, M2 chip, Touch ID in top button, USB-C.',
  35990.00,
  38990.00,
  'SKU-APL-IPDAIR',
  18,
  'gadgets',
  array['https://placehold.co/600x400/78716c/fff?text=iPad+Air'],
  '{"storage":["128GB","256GB","512GB","1TB"],"color":["Space Gray","Starlight","Blue","Purple"]}'::jsonb,
  false
),
(
  'iPad Pro 11-inch (M4)',
  'ipad-pro-11-m4',
  'Ultra Retina XDR OLED, M4, Pro cameras. Demo listing.',
  59990.00,
  null,
  'SKU-APL-IPDPRO11',
  10,
  'gadgets',
  array['https://placehold.co/600x400/0c0a09/fafaf9?text=iPad+Pro+11'],
  '{"storage":["256GB","512GB","1TB","2TB"],"color":["Space Black","Silver"]}'::jsonb,
  true
),
(
  'iPad mini (A17 Pro)',
  'ipad-mini-a17-pro',
  '8.3" Liquid Retina, A17 Pro, USB-C, compact powerhouse.',
  32990.00,
  null,
  'SKU-APL-IPDMINI',
  15,
  'gadgets',
  array['https://placehold.co/600x400/292524/e7e5e4?text=iPad+mini'],
  '{"storage":["128GB","256GB","512GB"],"color":["Space Gray","Starlight","Purple","Blue"]}'::jsonb,
  false
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_price = excluded.compare_price,
  sku = excluded.sku,
  stock = excluded.stock,
  category = excluded.category,
  images = excluded.images,
  variants = excluded.variants,
  is_featured = excluded.is_featured;

-- Default homepage copy (do not overwrite if admin already saved — use do nothing)
insert into public.site_settings (id, settings) values (
  'default',
  '{
    "heroKicker": "Premier gadgets",
    "heroTitle": "M-Zone Gadgets",
    "heroSubtitle": "iPhone, iPad, and more — demo catalog tuned for the Philippines.",
    "heroCtaLabel": "Shop now",
    "heroCtaHref": "/products",
    "showAnnouncement": false,
    "announcementText": "",
    "showValueStrip": true,
    "valueProps": [
      {"title": "Free shipping", "description": "Nationwide on qualifying orders (demo)."},
      {"title": "Secure checkout", "description": "GCash, cash on delivery, or card on delivery."},
      {"title": "Easy returns", "description": "Policy summary — edit in M-Zone Gadgets Admin → Storefront."}
    ],
    "showFeaturedSection": true,
    "featuredSectionKicker": "Featured products",
    "featuredSectionTitle": "Featured picks",
    "showCategorySection": true,
    "categorySectionKicker": "Shop by category",
    "categorySectionTitle": "Browse collections"
  }'::jsonb
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Orders: no seed rows here (need a real auth.users id). Create test orders from
-- the storefront checkout while logged in as a customer. Admin → Orders lists
-- them when SUPABASE_SERVICE_ROLE_KEY is set.
--
-- Notifications: `notifications` (per customer) and `admin_notifications` are
-- created in schema.sql; the app inserts rows on checkout and when admins
-- change order status. Add `public.notifications` to `supabase_realtime` (see
-- schema.sql) so customers get live in-app alerts.
-- -----------------------------------------------------------------------------

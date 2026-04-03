-- supabase/seed.sql — run after schema.sql
-- Create a public Storage bucket named "products" in Dashboard (public) for uploads.

insert into public.categories (name, slug) values
  ('Clothing', 'clothing'),
  ('Electronics', 'electronics'),
  ('Home', 'home')
on conflict (slug) do nothing;

insert into public.products (
  name, slug, description, price, compare_price, sku, stock, category, images, variants, is_featured
) values
(
  'Linen Barong Tagalog',
  'linen-barong-tagalog',
  '<p>Lightweight formal barong for events. Breathable linen blend.</p>',
  2499.00,
  2899.00,
  'SKU-BRG-001',
  24,
  'clothing',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Barong'],
  '{"size":["S","M","L","XL"],"color":["White","Beige"]}'::jsonb,
  true
),
(
  'Baybayin Graphic Tee',
  'baybayin-graphic-tee',
  'Cotton tee with Baybayin-inspired print.',
  599.00,
  null,
  'SKU-TSH-002',
  80,
  'clothing',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Tee'],
  '{"size":["S","M","L","XL"],"color":["Black","White"]}'::jsonb,
  false
),
(
  'USB-C GaN Charger 65W',
  'usb-c-gan-charger-65w',
  'Compact charger for laptops and phones. PH plug.',
  1299.00,
  1499.00,
  'SKU-EL-003',
  40,
  'electronics',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Charger'],
  null,
  true
),
(
  'Mechanical Keyboard (Taglish keycaps)',
  'mechanical-keyboard-taglish',
  'Hot-swap board with optional Taglish-themed keycap set.',
  4599.00,
  null,
  'SKU-EL-004',
  15,
  'electronics',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Keyboard'],
  '{"color":["Black","White"]}'::jsonb,
  false
),
(
  'Rattan Table Lamp',
  'rattan-table-lamp',
  'Handwoven accent lamp; warm LED bulb included.',
  1899.00,
  null,
  'SKU-HM-005',
  30,
  'home',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Lamp'],
  null,
  false
),
(
  'Capiz Shell Coasters (Set of 4)',
  'capiz-coasters-set',
  'Local capiz inlay coasters with cork backing.',
  449.00,
  549.00,
  'SKU-HM-006',
  100,
  'home',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Coasters'],
  null,
  false
),
(
  'Insulated Tumbler 900ml',
  'insulated-tumbler-900ml',
  'Stays cold in tropical heat. Leak-resistant lid.',
  799.00,
  null,
  'SKU-HM-007',
  60,
  'home',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Tumbler'],
  '{"color":["Sage","Coral","Black"]}'::jsonb,
  false
),
(
  'Portable Bluetooth Speaker IPX7',
  'portable-speaker-ipx7',
  'Beach-ready speaker with 12h battery.',
  2199.00,
  2599.00,
  'SKU-EL-008',
  22,
  'electronics',
  array['https://placehold.co/600x400/d6d3d1/57534e?text=Speaker'],
  '{"color":["Blue","Black"]}'::jsonb,
  false
)
on conflict (slug) do nothing;

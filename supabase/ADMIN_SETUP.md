# Admin email allowlist + Supabase (step by step)

**M-Zone Gadgets** uses **Supabase Auth** for login. Admin access is **not** stored in the database: the app checks whether the signed-in user’s **email** appears in the **`ADMIN_EMAILS`** environment variable (comma-separated). Mutations use the **service role** key on the server only.

## 1. Create the admin user in Supabase Auth

1. Open your project: [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication → Users**.
3. Either:
   - **Add user → Create new user**: enter the admin email and a password, or  
   - Register the same email through your app at **`/auth/register`**.

Use a real inbox you control for the demo (e.g. `you@example.com`).

## 2. (Optional) Confirm the `profiles` row

If you ran `schema.sql`, a trigger creates **`public.profiles`** when a user signs up.  
If something is missing, you can still use the app; the register flow also upserts `profiles`.

## 3. Copy API keys for your Next.js app

1. Go to **Project Settings → API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret; server-only)

> The **service_role** key bypasses RLS. It must only exist in **`.env.local`** (or Vercel env vars), never in client code or Git.

## 4. Configure `.env.local` in the Next.js repo

Add or update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Comma-separated; comparison is case-insensitive (example: project owner admin)
ADMIN_EMAILS=fortalezafranzandrew53@gmail.com
```

Restart `npm run dev` after changes.

## 5. Database: `site_settings` (homepage copy)

Run the **`schema.sql`** snippet that creates **`public.site_settings`** (or run the full file), then run **`seed.sql`** once so row `id = default` exists.  
Admin **Storefront** saves here; without the table, the site still works using built-in defaults.

## 6. Open the admin UI

1. Log in at **`/auth/login`** with the **same email** as in `ADMIN_EMAILS`.
2. You land on **`/admin`** (dashboard). While signed in as an admin, visiting **`/auth/login`** or **`/auth/register`** without a specific `callbackUrl` redirects to **`/admin`**.
3. To preview the public site, open **`/`** (homepage), use **Dashboard → Open live site**, **Products → View**, or browse **`/products`**.
4. While signed in as an admin on the storefront, use the **dark “Admin · live site preview” bar** (Return to control center), the **Control center** button in the header (desktop), or the same link at the top of the **mobile menu**.

Use the sidebar:
   - **Orders** — customer orders (requires **service role** to see all rows).
   - **Products** — full catalog control (needs service role to create/edit/delete).
   - **Storefront** — hero, announcement bar, value strip, which homepage sections show.
   - **Realtime** — run the `supabase_realtime` `add table` lines at the end of `schema.sql` for `products`, `orders`, and `notifications` so catalog and customer notification inserts stream to the app.
   - **Order status** — Admin → Orders includes a status dropdown (pending → delivered). Customers get a notification row and see live updates on **Account → Orders** when status changes.
5. If the amber banner appears, **`SUPABASE_SERVICE_ROLE_KEY`** is missing or wrong.

## 7. Add or edit products

- **List:** `/admin/products` (uses public read; no service role needed to view).
- **Create / update / delete:** requires **`SUPABASE_SERVICE_ROLE_KEY`** on the server.

Product **slugs** must stay unique (used in `/products/[slug]`).

## 8. Multiple admins (later)

Set:

```env
ADMIN_EMAILS=alice@corp.com,bob@corp.com
```

No Supabase schema change required for the allowlist itself.

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Redirect to **`/admin-denied`** from `/admin` | Email not in `ADMIN_EMAILS`, variable missing, or typo vs Auth user email. Restart dev server after editing `.env.local`. |
| After login you land on **Account** | Fixed in app: admins default to **`/admin/products`** unless `callbackUrl` points elsewhere (e.g. checkout). |
| Redirect to login | Not signed in; middleware protects `/admin`. |
| 503 / “missing service role” | `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, dev server restarted. |
| RLS errors on write | Writes go through **API routes + service role**, not the browser anon key. |

// src/features/auth/lib/admin-session-client.ts
/** Uses `/api/admin/check` (session cookie). Safe to call from client after sign-in. */
export async function fetchIsAdminSession(): Promise<boolean> {
  try {
    const r = await fetch("/api/admin/check");
    if (!r.ok) return false;
    const d = (await r.json()) as { isAdmin?: boolean };
    return Boolean(d.isAdmin);
  } catch {
    return false;
  }
}

/**
 * After login/register, send allowlisted admins to `/admin` when the intent is
 * generic (home or account). Preserves explicit callback URLs (e.g. checkout).
 */
export async function resolvePostAuthLandingPath(fallback: string): Promise<string> {
  if (!fallback.startsWith("/") || fallback.startsWith("//")) {
    return "/account";
  }
  if (await fetchIsAdminSession()) {
    if (fallback === "/account" || fallback === "/") {
      return "/admin";
    }
  }
  return fallback;
}

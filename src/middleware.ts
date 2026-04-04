// src/middleware.ts — refresh Supabase session + guard routes
import { type NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/shared/lib/admin";
import { createSupabaseMiddlewareClient } from "@/shared/lib/supabase/middleware";

/** After login/register, send allowlisted admins to the control center (or explicit callback). */
function adminAuthedRedirect(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const cb = request.nextUrl.searchParams.get("callbackUrl");
    const boring = new Set(["/", "/account", "/auth/login", "/auth/register", ""]);
    if (!cb || boring.has(cb)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (cb.startsWith("/") && !cb.startsWith("//")) {
      return NextResponse.redirect(new URL(cb, request.url));
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, supabase } = createSupabaseMiddlewareClient(request);

  if (!supabase) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email && isAdminEmail(user.email)) {
    if (pathname === "/checkout") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const adminRedirect = adminAuthedRedirect(request, pathname);
    if (adminRedirect) {
      return adminRedirect;
    }
  }

  const needsAuth =
    pathname.startsWith("/account") ||
    pathname === "/checkout" ||
    pathname.startsWith("/admin");

  if (needsAuth && !user) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

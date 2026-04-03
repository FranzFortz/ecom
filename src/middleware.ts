// src/middleware.ts
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!req.auth && pathname.startsWith("/account")) {
    const login = new URL("/auth/login", req.nextUrl.origin);
    login.searchParams.set(
      "callbackUrl",
      `${pathname}${req.nextUrl.search}`
    );
    return Response.redirect(login);
  }
  if (!req.auth && pathname === "/checkout") {
    const login = new URL("/auth/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", "/checkout");
    return Response.redirect(login);
  }
  return undefined;
});

export const config = {
  matcher: ["/account/:path*", "/checkout"],
};

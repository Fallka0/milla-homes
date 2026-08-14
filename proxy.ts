import { NextRequest, NextResponse } from "next/server";

import { adminSiteHost, adminSiteUrl, publicSiteHost, publicSiteUrl } from "@/lib/site-urls";
import { getShareLocaleFromPathname, shareLocaleHeaderName } from "@/lib/share-property";

function isLocalDevelopmentHost(host: string) {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.endsWith(".localhost");
}

/**
 * Continue the request, forwarding the share-page locale to the root layout so
 * it can put the right language on <html>. Used in place of a bare
 * NextResponse.next() everywhere below, including on localhost.
 */
function continueWithShareLocale(request: NextRequest) {
  const shareLocale = getShareLocaleFromPathname(request.nextUrl.pathname);

  if (!shareLocale) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(shareLocaleHeaderName, shareLocale);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

function redirectToBase(request: NextRequest, baseUrl: string) {
  const target = new URL(request.nextUrl.pathname + request.nextUrl.search, baseUrl);

  return NextResponse.redirect(target);
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() ?? request.nextUrl.host.toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (isLocalDevelopmentHost(host)) {
    return continueWithShareLocale(request);
  }

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApiPath = pathname === "/api/admin" || pathname.startsWith("/api/admin/");

  if (host === adminSiteHost) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/admin", adminSiteUrl));
    }

    if (isAdminPath || isAdminApiPath) {
      return NextResponse.next();
    }

    return redirectToBase(request, publicSiteUrl);
  }

  if (host === publicSiteHost && (isAdminPath || isAdminApiPath)) {
    return redirectToBase(request, adminSiteUrl);
  }

  return continueWithShareLocale(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|mov|ogg)$).*)",
  ],
};

import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { SessionUser } from "@/lib/auth/types";

function readSession(request: NextRequest): SessionUser | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionUser;
  } catch {
    return null;
  }
}

function isAdminRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/pendientes") ||
    pathname.startsWith("/reportes") ||
    pathname.startsWith("/recolectores")
  );
}

function isClientRoute(pathname: string) {
  return pathname.startsWith("/cliente");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = readSession(request);

  if (pathname.startsWith("/login") || pathname.startsWith("/sostenibilidad")) {
    if (pathname.startsWith("/login") && session) {
      const home =
        session.role === "cliente" ? "/cliente" : "/";
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role === "cliente" && isAdminRoute(pathname)) {
    return NextResponse.redirect(new URL("/cliente", request.url));
  }

  if (session.role === "administrador" && isClientRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

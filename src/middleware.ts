import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.zvezdaatelier.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const env = process.env.VERCEL_ENV;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (host.endsWith(".vercel.app") && env === "production") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (env === "preview" || (host.endsWith(".vercel.app") && env !== "production")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.jpg|assets/).*)"],
};

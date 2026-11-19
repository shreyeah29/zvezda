import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ATELIER_COOKIE = "zvezda_atelier";
export const ATELIER_PASSWORD_HEADER = "x-atelier-password";

export function atelierSecret() {
  return (process.env.ATELIER_PASSWORD || process.env.ORDER_EMAIL_SECRET || "").trim();
}

export function passwordMatches(input: string) {
  const expected = atelierSecret();
  if (!expected || !input) return false;
  const left = Buffer.from(input.trim());
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function passwordFromRequest(request: Request) {
  return request.headers.get(ATELIER_PASSWORD_HEADER) ?? "";
}

export function isAtelierAuthed(request: Request) {
  return passwordMatches(passwordFromRequest(request));
}

export function expiredCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function clearAtelierCookie() {
  const jar = await cookies();
  if (!jar.get(ATELIER_COOKIE)) return;
  jar.set(ATELIER_COOKIE, "", expiredCookieOptions());
}

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ATELIER_COOKIE = "zvezda_atelier";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function atelierSecret() {
  return (process.env.ATELIER_PASSWORD || process.env.ORDER_EMAIL_SECRET || "").trim();
}

export function passwordMatches(input: string) {
  const expected = atelierSecret();
  if (!expected || !input) return false;
  const left = Buffer.from(input);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function sign(value: string) {
  const secret = atelierSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function makeSessionValue() {
  const exp = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

export function sessionIsValid(value: string | undefined) {
  if (!value || !atelierSecret()) return false;
  const [exp, signature] = value.split(".");
  if (!exp || !signature) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAtelierAuthed() {
  const jar = await cookies();
  return sessionIsValid(jar.get(ATELIER_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

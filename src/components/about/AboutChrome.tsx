"use client";

import { useEffect } from "react";

/** Marks <html> so the fixed nav can use About-page styles. */
export function AboutChrome() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("about-page-active");
    return () => {
      root.classList.remove("about-page-active");
    };
  }, []);

  return null;
}

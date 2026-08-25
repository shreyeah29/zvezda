"use client";

import { useEffect } from "react";

/** Puts Jost and the About page class on <html> so the fixed nav can use them. */
export function AboutChrome({ fontVariable }: { fontVariable: string }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("about-page-active", fontVariable);
    return () => {
      root.classList.remove("about-page-active", fontVariable);
    };
  }, [fontVariable]);

  return null;
}

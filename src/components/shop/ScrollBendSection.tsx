"use client";

import type { CSSProperties, ReactNode } from "react";
import "./ScrollBendSection.css";

type ScrollBendSectionProps = {
  hero: ReactNode;
  children: ReactNode;
  backgroundColor?: string;
  topRadius?: number;
  overlap?: string;
  scrollRoom?: string;
};

export function ScrollBendSection({
  hero,
  children,
  backgroundColor = "#0a0908",
  topRadius = 40,
  overlap = "clamp(2rem, 5vh, 3.5rem)",
  scrollRoom = "50vh",
}: ScrollBendSectionProps) {
  const panelStyle = {
    "--scroll-bend-bg": backgroundColor,
    "--scroll-bend-radius": `${topRadius}px`,
    "--scroll-bend-overlap": overlap,
  } as CSSProperties;

  return (
    <div className="scroll-bend-stack" style={panelStyle}>
      <div className="scroll-bend-stack__pin" style={{ height: `calc(100vh + ${scrollRoom})` }}>
        <div className="scroll-bend-stack__hero">{hero}</div>
      </div>

      <section className="scroll-bend-stack__panel">{children}</section>
    </div>
  );
}

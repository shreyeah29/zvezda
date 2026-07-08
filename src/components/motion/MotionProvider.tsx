"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";
import { SharedTransitionProvider } from "./SharedTransitionProvider";

/**
 * Root motion context — enables shared layout animations across routes.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LayoutGroup id="zvezda">
      <SharedTransitionProvider>{children}</SharedTransitionProvider>
    </LayoutGroup>
  );
}

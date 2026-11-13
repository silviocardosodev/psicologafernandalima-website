"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global motion config. `reducedMotion="user"` makes framer skip transform/layout
 * animations for users with prefers-reduced-motion, without components having to
 * branch their `initial`/`animate` values (which would cause SSR/client mismatches).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

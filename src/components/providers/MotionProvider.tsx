"use client";

import { LazyMotion, MotionConfig, domMax } from "framer-motion";

/**
 * Global motion config.
 * - `LazyMotion` + `m.*` components ship only the animation features we use (domMax is
 *   needed for layoutId / layout animations). `strict` throws if any `motion.*` slips in,
 *   so the full bundle never sneaks back.
 * - `reducedMotion="user"` makes framer skip transform/layout animations for users with
 *   prefers-reduced-motion, without components branching their `initial`/`animate` values
 *   (which would cause SSR/client mismatches).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

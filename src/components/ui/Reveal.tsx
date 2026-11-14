"use client";

import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

/**
 * Lifts content into place once it enters the viewport.
 * Content is NEVER hidden in the server HTML (no opacity:0): on slow 4G, in the Instagram
 * in-app browser or if JS fails, everything stays readable. Only the position animates.
 * `initial`/`whileInView` are identical on server and client (no hydration mismatch);
 * with reduced motion the transition is instant.
 */
export function Reveal({ delay = 0, y = 18, children, ...props }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </m.div>
  );
}

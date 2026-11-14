import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

/** Centered page container: max 1240px (PsicoFlow page layout), 20/24/40px gutters. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-10", className)}>{children}</div>;
}

/** Vertical rhythm for every section: 80px mobile → 120px desktop. */
export function Section({
  id,
  className,
  children,
  "aria-labelledby": labelledBy,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-28 lg:py-32", className)}>
      {children}
    </section>
  );
}

/** Small letter-spaced label above headings — quiet, no pill. */
export function Eyebrow({ children, className, tone = "primary" }: { children: ReactNode; className?: string; tone?: "primary" | "light" }) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold tracking-[0.14em] uppercase",
        tone === "primary" ? "text-primary" : "text-white/90",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Standard section heading block: eyebrow + h2 + lead. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className="mt-3 text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">{description}</p>
      )}
    </Reveal>
  );
}

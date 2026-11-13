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
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-24 lg:py-30", className)}>
      {children}
    </section>
  );
}

/** Uppercase meta label — PsicoFlow eyebrow style (12px / 600 / 0.05em). */
export function Eyebrow({ children, className, tone = "primary" }: { children: ReactNode; className?: string; tone?: "primary" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.05em] uppercase",
        tone === "primary" ? "bg-primary-100 text-primary-hover" : "bg-white/12 text-white ring-1 ring-white/20",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", tone === "primary" ? "bg-primary" : "bg-white")} />
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
        className="mt-4 text-[32px] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[44px]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}

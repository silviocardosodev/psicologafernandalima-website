import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-55 focus-visible:shadow-focus";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white border border-primary shadow-[0_10px_30px_rgb(79_70_229/22%)] hover:bg-primary-hover hover:border-primary-hover hover:-translate-y-px",
  secondary:
    "bg-primary-100 text-primary-hover border border-primary-100 hover:bg-primary-200 hover:border-primary-200",
  outline:
    "bg-white/70 text-ink border border-line hover:bg-white hover:border-line-hover",
  ghost: "text-ink-soft hover:text-ink hover:bg-surface-hover",
  whatsapp:
    "bg-whatsapp text-white border border-whatsapp shadow-[0_8px_24px_rgb(15_122_59/24%)] hover:bg-whatsapp-hover hover:border-whatsapp-hover hover:-translate-y-px",
  light:
    "bg-white text-primary-hover border border-white shadow-raised hover:bg-primary-100 hover:-translate-y-px",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-8 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonLinkProps = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children"> & {
    external?: boolean;
  };

/** Anchor styled as a button. `external` opens in a new tab safely and announces it to screen readers. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  external,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={buttonClasses({ variant, size, className })}
    >
      {children}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant, size, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} {...props} className={buttonClasses({ variant, size, className })}>
      {children}
    </button>
  );
}

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * Fernanda Lima's brand symbol (double "C" forming a stylised Ψ), extracted as a vector
 * from the logo on psicologafernandalima.com.br and recoloured to the PsicoFlow palette.
 * - `gradient` (default): indigo gradient, for light backgrounds
 * - `light`: solid white, for the dark indigo footer / bands
 * - `original`: the brand's original light blue (#a2c1f7)
 */
export function BrandMark({
  className,
  tone = "gradient",
  title,
}: {
  className?: string;
  tone?: "gradient" | "light" | "original";
  title?: string;
}) {
  const gradientId = `brand-mark-${useId().replace(/:/g, "")}`;
  const fill = tone === "light" ? "#ffffff" : tone === "original" ? "#a2c1f7" : `url(#${gradientId})`;

  return (
    <svg
      viewBox="0 0 3040 3311"
      className={cn("h-auto shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fillRule="evenodd"
      clipRule="evenodd"
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6f82ff" />
            <stop offset="0.45" stopColor="#4f46e5" />
            <stop offset="1" stopColor="#312e81" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fill}
        d="M541.87 1771.25H236.56c59.01 731.93 671.64 1307.47 1418.77 1307.47 63.87 0 115.95 52.08 115.95 115.95 0 63.86-52.08 115.95-115.95 115.95C741.16 3310.62.01 2569.47.01 1655.3S741.16-.02 1655.33-.02c544.92 0 1054.94 268.2 1363.79 717.14 36.19 52.62 22.79 125.05-29.81 161.25-52.62 36.19-125.05 22.79-161.25-29.81-265.57-386.06-704.15-616.68-1172.73-616.68-747.13 0-1359.76 575.54-1418.77 1307.47h302.93c17.22-183.35 80.13-364.94 191.98-527.25 208.33-302.35 552.14-482.8 919.32-482.51 63.86.05 115.9 52.18 115.85 116.04-.04 63.87-52.17 115.91-116.04 115.86-290.84-.22-563.15 142.7-728.19 382.19-276.72 401.61-175.4 952.04 226.2 1228.78 401.61 276.72 952.05 175.41 1228.79-226.21 36.23-52.58 108.67-65.93 161.26-29.68 52.58 36.23 65.93 108.68 29.68 161.26C2219.02 2784.8 1524 2912.74 1017.03 2563.4c-276.11-190.24-439.79-483.04-475.16-792.15z"
      />
      <path fill={fill} d="m412.71 2739.12-225.61-35.14 35.14-225.61 190.47 260.75z" />
    </svg>
  );
}

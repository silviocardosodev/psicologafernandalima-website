import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import type { Quote, QuoteTheme } from "@/lib/quotes";
import { site } from "@/lib/site";

/**
 * Renders a quote as a PNG (pre-rendered at build time). Used by:
 * - /cartoes/[id]: 1080×1350 Instagram post, shared/downloaded from the site;
 * - /[dor]/opengraph-image: 1200×630 link preview of each pain page.
 */
export const POST_SIZE = { width: 1080, height: 1350 } as const;
export const OG_SIZE = { width: 1200, height: 630 } as const;

const BRAND_PATH =
  "M541.87 1771.25H236.56c59.01 731.93 671.64 1307.47 1418.77 1307.47 63.87 0 115.95 52.08 115.95 115.95 0 63.86-52.08 115.95-115.95 115.95C741.16 3310.62.01 2569.47.01 1655.3S741.16-.02 1655.33-.02c544.92 0 1054.94 268.2 1363.79 717.14 36.19 52.62 22.79 125.05-29.81 161.25-52.62 36.19-125.05 22.79-161.25-29.81-265.57-386.06-704.15-616.68-1172.73-616.68-747.13 0-1359.76 575.54-1418.77 1307.47h302.93c17.22-183.35 80.13-364.94 191.98-527.25 208.33-302.35 552.14-482.8 919.32-482.51 63.86.05 115.9 52.18 115.85 116.04-.04 63.87-52.17 115.91-116.04 115.86-290.84-.22-563.15 142.7-728.19 382.19-276.72 401.61-175.4 952.04 226.2 1228.78 401.61 276.72 952.05 175.41 1228.79-226.21 36.23-52.58 108.67-65.93 161.26-29.68 52.58 36.23 65.93 108.68 29.68 161.26C2219.02 2784.8 1524 2912.74 1017.03 2563.4c-276.11-190.24-439.79-483.04-475.16-792.15zM412.71 2739.12l-225.61-35.14 35.14-225.61 190.47 260.75z";

const themes: Record<QuoteTheme, { bg: string; text: string; accent: string; muted: string; mark: string }> = {
  lilac: {
    bg: "linear-gradient(160deg, #fbfaff 0%, #f4efff 45%, #e3ddff 100%)",
    text: "#312e81",
    accent: "#747ff5",
    muted: "#555d70",
    mark: "#4f46e5",
  },
  brand: {
    bg: "linear-gradient(150deg, #7b8bff 0%, #4f46e5 48%, #312e81 100%)",
    text: "#ffffff",
    accent: "#d8d4ff",
    muted: "rgba(255,255,255,0.82)",
    mark: "#ffffff",
  },
  white: {
    bg: "radial-gradient(80% 60% at 100% 0%, #ece8ff 0%, #ffffff 65%)",
    text: "#171b2c",
    accent: "#4f46e5",
    muted: "#555d70",
    mark: "#4f46e5",
  },
};

function brandDataUri(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3040 3311"><path fill="${color}" fill-rule="evenodd" d="${BRAND_PATH}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function loadFonts() {
  const dir = path.join(process.cwd(), "src", "assets", "fonts");
  const [regular, semibold] = await Promise.all([
    readFile(path.join(dir, "Inter-Regular.ttf")),
    readFile(path.join(dir, "Inter-SemiBold.ttf")),
  ]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

export async function renderQuoteImage(quote: Pick<Quote, "text" | "theme">, format: "post" | "og" = "post") {
  const t = themes[quote.theme];
  const size = format === "post" ? POST_SIZE : OG_SIZE;
  const isPost = format === "post";
  const long = quote.text.length > 48;
  const fontSize = isPost ? (long ? 72 : 84) : long ? 52 : 60;
  const pad = isPost ? 96 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: pad,
          backgroundImage: t.bg,
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
          color: t.text,
        }}
      >
        <div style={{ display: "flex", fontSize: isPost ? 180 : 120, lineHeight: 0.8, color: t.accent, fontWeight: 600 }}>
          “
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: isPost ? 48 : 28 }}>
          <div
            style={{
              display: "flex",
              fontSize,
              lineHeight: 1.14,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              maxWidth: isPost ? 860 : 1000,
            }}
          >
            {quote.text}
          </div>
          <svg width={isPost ? 220 : 160} height={isPost ? 30 : 22} viewBox="0 0 160 24" fill="none">
            <path
              d="M2 12c6-9 10-9 14 0s8 9 12 0 7-8 11 0 9 7 15 0 12-6 20 0 16 5 26 0 18-4 28 0 16 3 30 0"
              stroke={t.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brandDataUri(t.mark)} width={isPost ? 64 : 52} height={isPost ? 70 : 57} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: isPost ? 32 : 26, fontWeight: 600 }}>{site.name}</div>
              <div style={{ display: "flex", fontSize: isPost ? 24 : 20, color: t.muted, marginTop: 4 }}>
                Psicóloga · {site.crp}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: isPost ? 26 : 22, color: t.muted }}>@{site.instagram}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}

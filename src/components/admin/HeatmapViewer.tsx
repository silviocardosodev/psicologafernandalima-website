"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import type { HeatDevice, HeatPoint } from "@/lib/admin/data";
import { findZone } from "@/lib/heatZones";

const FRAMES: Record<HeatDevice, { w: number; h: number }> = {
  mobile: { w: 390, h: 780 },
  tablet: { w: 820, h: 1000 },
  desktop: { w: 1280, h: 800 },
};

const CANVAS_ID = "fl-heatmap-layer";
const RADIUS = 26; // px at page scale

/** Single warm sequential ramp (light amber → deep red): reads clearly over the purple site. */
const STOPS: [number, [number, number, number]][] = [
  [0, [254, 243, 199]],
  [0.25, [253, 186, 116]],
  [0.5, [249, 115, 22]],
  [0.75, [220, 38, 38]],
  [1, [127, 29, 29]],
];

function buildLut() {
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const j = STOPS.findIndex(([s]) => s >= t);
    const [s1, c1] = STOPS[Math.max(0, j - 1)];
    const [s2, c2] = STOPS[Math.max(0, j)];
    const k = s2 === s1 ? 0 : (t - s1) / (s2 - s1);
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = c1[c] + (c2[c] - c1[c]) * k;
  }
  return lut;
}

export const heatGradientCss = `linear-gradient(90deg, ${STOPS.map(([s, c]) => `rgb(${c.join(" ")}) ${s * 100}%`).join(", ")})`;

/**
 * Loads the real page in a same-origin iframe at the chosen device width and paints the
 * clicks onto a canvas injected into that page, so the heat scrolls with the content.
 * Each click is anchored to its section (see src/lib/heatZones.ts).
 */
export function HeatmapViewer({ path, device, points }: { path: string; device: HeatDevice; points: HeatPoint[] }) {
  const frame = FRAMES[device];
  const wrapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [placed, setPlaced] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / frame.w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [frame.w]);

  const draw = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const win = iframeRef.current?.contentWindow;
    if (!doc || !win || !doc.body) return;

    doc.getElementById(CANVAS_ID)?.remove();
    const root = doc.documentElement;
    const width = root.scrollWidth;
    const height = root.scrollHeight;
    const k = Math.min(0.5, 8000 / height); // render at reduced resolution: heat needs no detail

    const canvas = doc.createElement("canvas");
    canvas.id = CANVAS_ID;
    canvas.width = Math.ceil(width * k);
    canvas.height = Math.ceil(height * k);
    Object.assign(canvas.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "none",
      zIndex: "2147483647",
      display: visible ? "block" : "none",
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxN = Math.max(...points.map((p) => p.n), 1);
    const r = RADIUS * k;
    let count = 0;
    for (const p of points) {
      let x: number;
      let y: number;
      if (p.zone === "page") {
        x = p.rx * width;
        y = p.ry * height;
      } else {
        const zone = findZone(doc, p.zone);
        if (!zone) continue;
        const box = zone.getBoundingClientRect();
        x = box.left + win.scrollX + p.rx * box.width;
        y = box.top + win.scrollY + p.ry * box.height;
      }
      count += p.n;
      const g = ctx.createRadialGradient(x * k, y * k, 0, x * k, y * k, r);
      const a = 0.04 + 0.2 * (p.n / maxN);
      g.addColorStop(0, `rgba(0,0,0,${a})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x * k - r, y * k - r, r * 2, r * 2);
    }

    // Colorize: alpha → warm ramp, normalized so the hottest spot is the darkest step.
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = img.data;
    let peak = 1;
    for (let i = 3; i < px.length; i += 4) if (px[i] > peak) peak = px[i];
    const lut = buildLut();
    for (let i = 0; i < px.length; i += 4) {
      const a = px[i + 3];
      if (!a) continue;
      const v = Math.min(255, Math.round((a / peak) * 255));
      px[i] = lut[v * 3];
      px[i + 1] = lut[v * 3 + 1];
      px[i + 2] = lut[v * 3 + 2];
      px[i + 3] = Math.min(190, 50 + v * 0.55);
    }
    ctx.putImageData(img, 0, 0);

    doc.body.style.position ||= "relative";
    doc.body.appendChild(canvas);
    setPlaced(count);
  }, [points, visible]);

  const onLoad = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    // A preview, not a browser: links and buttons don't navigate away from the page being analysed.
    doc.addEventListener("click", (e) => e.preventDefault(), true);
    setLoading(false);
    draw();
    // Images, fonts and entrance animations shift the layout a little after load.
    setTimeout(draw, 900);
    setTimeout(draw, 2500);
  }, [draw]);

  useEffect(() => {
    if (!loading) draw();
  }, [draw, loading]);

  // The iframe may finish loading before hydration attaches onLoad: catch up on mount.
  const caughtUp = useRef(false);
  useEffect(() => {
    if (caughtUp.current) return;
    const doc = iframeRef.current?.contentDocument;
    if (doc && doc.readyState === "complete" && doc.location.href !== "about:blank") {
      caughtUp.current = true;
      onLoad();
    }
  }, [onLoad]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-ink-soft">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="size-4 accent-primary" />
          Mostrar mapa
        </label>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>menos</span>
          <span aria-hidden className="h-2.5 w-28 rounded-full" style={{ background: heatGradientCss }} />
          <span>mais cliques</span>
        </div>
      </div>

      <div ref={wrapRef} className="w-full">
        <div
          className="relative mx-auto overflow-hidden rounded-[1.75rem] border-[6px] border-ink/90 bg-white shadow-[0_20px_50px_rgb(23_27_44/18%)]"
          style={{ width: frame.w * scale + 12, height: frame.h * scale + 12 }}
        >
          <iframe
            key={`${path}-${device}`}
            ref={iframeRef}
            src={path}
            title={`Prévia da página ${path} com o mapa de calor`}
            onLoad={onLoad}
            sandbox="allow-same-origin allow-scripts"
            style={{ width: frame.w, height: frame.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}
            className="block border-0"
          />
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-white/80 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <Loader2 aria-hidden className="size-4 animate-spin" /> Carregando a página…
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-ink-muted" aria-live="polite">
        {placed === null ? "" : placed ? `${placed.toLocaleString("pt-BR")} cliques desenhados. Role dentro da prévia para ver a página toda.` : "Nenhum clique registrado nesta página e aparelho no período."}
      </p>
    </div>
  );
}

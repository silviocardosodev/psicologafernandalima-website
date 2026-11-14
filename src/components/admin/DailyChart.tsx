import { nf } from "@/lib/admin/labels";

const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" });
const weekdayFmt = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });

/**
 * Visits per day: one series, one hue, bars anchored to the baseline with rounded tops,
 * 2px gaps, recessive gridlines, hover tooltip per bar, and a screen-reader table.
 */
export function DailyChart({ data, days }: { data: { day: string; visits: number }[]; days: number }) {
  // Fill missing days with zero so gaps read as "no visits", not as a squeezed axis.
  const byDay = new Map(data.map((d) => [d.day, d.visits]));
  const series = Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    const key = date.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    return { key, date: new Date(`${key}T00:00:00Z`), visits: byDay.get(key) ?? 0 };
  });
  const max = Math.max(...series.map((d) => d.visits), 1);
  const top = niceCeil(max);
  const ticks = [top, top / 2, 0];
  const labelEvery = Math.ceil(days / 6);

  return (
    <div>
      <div className="relative h-52 pl-9">
        {ticks.map((t) => (
          <div key={t} className="absolute right-0 left-9 border-t border-line-soft" style={{ bottom: `${(t / top) * 100}%` }}>
            <span className="absolute -top-2 -left-9 w-7 text-right text-[11px] text-ink-muted tabular-nums">{nf.format(t)}</span>
          </div>
        ))}
        <div aria-hidden className="relative flex h-full items-end gap-[2px]">
          {series.map((d) => (
            <div key={d.key} className="group relative flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-[4px] bg-primary transition-colors group-hover:bg-primary-deep"
                style={{ height: `${(d.visits / top) * 100}%`, minHeight: d.visits ? 2 : 0 }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-white shadow-raised group-hover:block">
                <span className="block text-white/70 capitalize">{weekdayFmt.format(d.date)}</span>
                <span className="font-semibold">{nf.format(d.visits)} visitas</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="mt-2 flex gap-[2px] pl-9 text-[11px] text-ink-muted">
        {series.map((d, i) => (
          <span key={d.key} className="flex-1 text-center whitespace-nowrap">
            {i % labelEvery === 0 ? dayFmt.format(d.date).replace(".", "") : ""}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Visitas por dia</caption>
        <thead>
          <tr>
            <th>Dia</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {series.map((d) => (
            <tr key={d.key}>
              <td>{weekdayFmt.format(d.date)}</td>
              <td>{d.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function niceCeil(n: number) {
  const pow = 10 ** Math.floor(Math.log10(n));
  const steps = [1, 2, 2.5, 5, 10];
  const step = steps.find((s) => s * pow >= n) ?? 10;
  return Math.max(2, step * pow);
}

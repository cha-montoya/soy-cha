function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(Number(value || 0));
}

export default function PerformanceBars({ title, items, metric = "posts" }) {
  const max = Math.max(...items.map((item) => Number(item[metric] || 0)), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.length ? items.map((item) => {
          const value = Number(item[metric] || 0);
          const width = Math.max((value / max) * 100, value ? 4 : 0);
          return (
            <div key={item.name}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                <span className="truncate font-medium text-slate-800">{item.name || "Uncategorized"}</span>
                <span className="shrink-0 tabular-nums text-slate-500">{formatNumber(value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-900" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        }) : <p className="text-sm text-slate-500">No performance data yet.</p>}
      </div>
    </section>
  );
}

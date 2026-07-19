const ITEMS = [
  {
    key: "pending",
    label: "Pending",
  },
  {
    key: "scheduled",
    label: "Scheduled",
  },
  {
    key: "published",
    label: "Published",
  },
  {
    key: "failed",
    label: "Failed",
  },
];

export default function QueueCard({ queue }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-950">
          Publication queue
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution status across active channels.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {queue[item.key] ?? 0}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
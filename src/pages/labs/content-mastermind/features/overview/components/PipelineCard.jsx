function getProgress(value, maximum) {
  if (!maximum) {
    return 0;
  }

  return Math.min(100, Math.round((value / maximum) * 100));
}

export default function PipelineCard({ pipeline }) {
  const maximum = Math.max(
    ...pipeline.map((item) => item.value),
    0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-950">
          Content pipeline
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current volume at each stage of production.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {pipeline.map((item) => {
          const progress = getProgress(item.value, maximum);

          return (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>

                <span className="text-sm font-semibold text-slate-950">
                  {item.value}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-800 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
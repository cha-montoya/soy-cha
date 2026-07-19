export default function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon size={21} weight="duotone" />
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </article>
  );
}
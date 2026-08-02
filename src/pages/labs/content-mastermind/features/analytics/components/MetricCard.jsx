export default function MetricCard({ label, value, helper = null, icon: Icon = null }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        {Icon ? <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={20} weight="regular" /></div> : null}
      </div>
      {helper ? <p className="mt-3 text-xs font-normal leading-5 text-slate-400">{helper}</p> : null}
    </article>
  );
}

import { BuildingsIcon } from "@phosphor-icons/react";

export default function BrandHeader({ companyName, companyLogo }) {
  const displayName = companyName || "Content Mastermind";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-44 flex-col justify-between gap-8 p-6 sm:p-8 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${displayName} logo`}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <BuildingsIcon
                size={34}
                weight="duotone"
                className="text-slate-400"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              AI Content Operations Center
            </p>

            <h1 className="truncate text-2xl font-semibold text-slate-950 sm:text-3xl">
              {displayName}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor content ingestion, AI analysis, generation,
              visual production and publishing from one place.
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Workspace
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            Content Mastermind
          </p>
        </div>
      </div>
    </section>
  );
}
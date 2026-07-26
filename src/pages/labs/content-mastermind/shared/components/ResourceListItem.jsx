export default function ResourceListItem({
  selected = false,
  onClick,
  leading = null,
  title,
  badge = null,
  meta = null,
  children = null,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={[
        "w-full border-b border-l-4 p-4 text-left transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-700",
        selected
          ? "border-l-slate-700 bg-slate-50"
          : "border-l-transparent bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        {leading && <div className="shrink-0">{leading}</div>}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
              {title || "Untitled item"}
            </p>

            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {children}

          {meta && (
            <div className="mt-2 text-xs leading-5 text-gray-500">
              {meta}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

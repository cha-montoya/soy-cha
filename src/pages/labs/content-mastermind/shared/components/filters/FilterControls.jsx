import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

const baseControl =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10";

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search</span>
      <MagnifyingGlassIcon
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${baseControl} pl-9`}
      />
    </label>
  );
}

export function SelectInput({ value, onChange, options, label }) {
  return (
    <label className="block min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${baseControl} min-w-[150px]`}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateInput({ value, onChange, label }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={baseControl}
      />
    </label>
  );
}

export function ClearFiltersButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-40"
    >
      <XIcon size={15} weight="bold" />
      Clear
    </button>
  );
}

export function FilterPanel({ children }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50/70 p-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(220px,1fr)_auto_auto_auto]">
        {children}
      </div>
    </div>
  );
}

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Button from "../Button";

const inputClass =
  "input w-full border-b border-neutral-300 bg-transparent py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none placeholder:text-slate-400";

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">Search</span>
      <MagnifyingGlassIcon
        size={18}
        weight="regular"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-7`}
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
        className={`${inputClass} min-w-0 cursor-pointer pr-7`}
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function DateInput({ value, onChange, label }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function ClearFiltersButton({ onClick, disabled = false, label = "Clear filters" }) {
  return (
    <Button type="button" variant="secondary" onClick={onClick} disabled={disabled} className="w-full sm:w-auto">
      <XIcon size={17} weight="regular" />
      {label}
    </Button>
  );
}

export function FilterPanel({ children }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-5">
      <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

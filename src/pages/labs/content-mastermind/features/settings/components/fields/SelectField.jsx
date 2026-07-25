export default function SelectField({
  label,
  name,
  value,
  options = [],
  onChange,
  placeholder = "Select an option",
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
      >
        {!value && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
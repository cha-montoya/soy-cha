import { useEffect, useState } from "react";

const HEX_PATTERN = /^#[0-9A-F]{6}$/i;

function normalizeHex(value) {
  const cleanValue = value.trim().replace(/[^0-9a-fA-F]/g, "").slice(0, 6);

  return `#${cleanValue.toUpperCase()}`;
}

export default function ColorField({
  label,
  name,
  value = "#000000",
  onChange,
  description,
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleColorChange = (event) => {
    const nextValue = event.target.value.toUpperCase();

    setInputValue(nextValue);
    onChange(name, nextValue);
  };

  const handleTextChange = (event) => {
    const nextValue = normalizeHex(event.target.value);

    setInputValue(nextValue);

    if (HEX_PATTERN.test(nextValue)) {
      onChange(name, nextValue);
    }
  };

  const handleBlur = () => {
    if (!HEX_PATTERN.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={`${name}-text`}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      {description && (
        <p className="text-sm leading-5 text-slate-500">
          {description}
        </p>
      )}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          transition
          focus-within:border-black
          focus-within:ring-2
          focus-within:ring-black/10
        "
      >
        <label
          htmlFor={`${name}-picker`}
          className="
            relative
            h-8
            w-8
            shrink-0
            cursor-pointer
            overflow-hidden
            rounded-md
            border
            border-slate-300
          "
          style={{ backgroundColor: value }}
          aria-label={`Select ${label}`}
        >
          <input
            id={`${name}-picker`}
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>

        <input
          id={`${name}-text`}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          maxLength={7}
          spellCheck="false"
          autoComplete="off"
          className="input w-full border-b border-neutral-300 bg-transparent py-3 focus:outline-none"
        />
      </div>
    </div>
  );
}
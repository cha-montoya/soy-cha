import Spinner from "./Spinner";

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  onClick,
  className = "",
  type = "button",
}) {
  const variants = {
    primary: `
      border-black
      bg-black
      text-white
      hover:bg-neutral-900
      hover:border-neutral-900
    `,

    secondary: `
      border-gray-300
      bg-white
      text-gray-900
      hover:border-black
      hover:bg-gray-100
    `,

    success: `
      border-green-700
      bg-green-700
      text-white
      hover:bg-green-800
      hover:border-green-800
    `,

    warning: `
      border-yellow-500
      bg-yellow-500
      text-black
      hover:bg-yellow-400
      hover:border-yellow-400
    `,

    danger: `
      border-red-600
      bg-red-600
      text-white
      hover:bg-red-700
      hover:border-red-700
    `,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}
      className={`
        inline-flex
        min-w-[220px]
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        border
        px-6
        py-3.5
        font-mono
        text-sm
        font-medium
        uppercase
        tracking-[0.18rem]
        transition-all
        duration-200
        ease-out

        disabled:pointer-events-none
        disabled:opacity-50

        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {loading && <Spinner size={16} />}

      <span>{loading ? loadingText : children}</span>
    </button>
  );
}
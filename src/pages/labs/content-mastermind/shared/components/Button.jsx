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
      hover:bg-white
      hover:text-black
    `,

    secondary: `
      border-gray-300
      bg-white
      text-gray-800
      hover:border-black
      hover:bg-gray-50
    `,

    success: `
      border-green-700
      bg-green-700
      text-white
      hover:bg-white
      hover:text-green-700
    `,

    warning: `
      border-yellow-500
      bg-yellow-500
      text-black
      hover:bg-white
    `,

    danger: `
      border-red-600
      bg-red-600
      text-white
      hover:bg-white
      hover:text-red-600
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
        whitespace-nowrap
        min-w-[220px]
        items-center
        justify-center
        gap-2
        border-1
        p-4
        font-mono
        text-sm
        uppercase
        tracking-[0.2rem]
        transition-all
        duration-200
        ease-out
        hover:bg-white
        hover:text-gray-900
        hover:border-2
        hover:border-gray-900
        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {loading && (
        <Spinner
          size={16}
          aria-hidden="true"
        />
      )}

      <span>
        {loading ? loadingText : children}
      </span>
    </button>
  );
}
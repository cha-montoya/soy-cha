import Spinner from "./Spinner";

const VARIANTS = {
  primary: "border-slate-950 bg-slate-950 text-white hover:border-slate-800 hover:bg-slate-800",
  secondary: "border-slate-300 bg-white text-slate-800 hover:border-slate-950 hover:text-slate-950",
  ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  success: "border-emerald-700 bg-emerald-700 text-white hover:border-emerald-800 hover:bg-emerald-800",
  warning: "border-amber-500 bg-amber-500 text-slate-950 hover:border-amber-400 hover:bg-amber-400",
  danger: "border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10 p-0",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  onClick,
  className = "",
  type = "button",
  title,
  "aria-label": ariaLabel,
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading}
      aria-label={ariaLabel}
      title={title}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium leading-none transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-50 ${SIZES[size] || SIZES.md} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
    >
      {loading ? <Spinner size={16} /> : null}
      <span className="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap">
        {loading ? loadingText : children}
      </span>
    </button>
  );
}

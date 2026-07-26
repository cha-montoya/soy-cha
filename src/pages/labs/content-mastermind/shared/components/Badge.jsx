const VARIANT_STYLES = {
  neutral: "border-slate-200 bg-slate-100 text-slate-600",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
};

const SIZE_STYLES = {
  sm: "min-h-6 px-2.5 py-1 text-[11px]",
  md: "min-h-7 px-3 py-1.5 text-xs",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon = null,
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border",
        "font-semibold uppercase leading-none tracking-[0.08em]",
        VARIANT_STYLES[variant] || VARIANT_STYLES.neutral,
        SIZE_STYLES[size] || SIZE_STYLES.sm,
        className,
      ].join(" ")}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

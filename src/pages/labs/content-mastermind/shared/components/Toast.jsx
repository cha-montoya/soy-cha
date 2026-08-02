import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";

const toastVariants = {
  success: {
    icon: CheckCircleIcon,
    iconClassName: "text-green-600",
    borderClassName: "border-green-600",
  },

  error: {
    icon: XCircleIcon,
    iconClassName: "text-red-600",
    borderClassName: "border-red-600",
  },

  warning: {
    icon: WarningCircleIcon,
    iconClassName: "text-yellow-600",
    borderClassName: "border-yellow-500",
  },

  info: {
    icon: InfoIcon,
    iconClassName: "text-blue-600",
    borderClassName: "border-blue-600",
  },
};

export default function Toast({
  type = "info",
  title,
  message,
  onClose,
}) {
  const variant = toastVariants[type] || toastVariants.info;
  const Icon = variant.icon;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`
        pointer-events-auto
        w-full
        max-w-md
        border-l-4
        bg-white
        shadow-lg
        ${variant.borderClassName}
      `}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon
          size={24}
          weight="fill"
          className={`mt-0.5 flex-shrink-0 ${variant.iconClassName}`}
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          {title && (
            <p className="text-sm font-medium text-gray-900">
              {title}
            </p>
          )}

          {message && (
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-transparent text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20"
          aria-label="Cerrar notificación"
        >
          <XIcon
            size={18}
            weight="regular"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        fixed
        right-4
        top-4
        z-[100]
        flex
        w-[calc(100%-2rem)]
        max-w-md
        flex-col
        gap-3
        sm:right-6
        sm:top-6
      "
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
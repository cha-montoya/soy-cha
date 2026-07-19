import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ToastViewport } from "../components/Toast";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 5000;

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const showToast = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = DEFAULT_DURATION,
    }) => {
      const toastId = createToastId();

      const newToast = {
        id: toastId,
        type,
        title,
        message,
      };

      setToasts((currentToasts) => [
        ...currentToasts,
        newToast,
      ]);

      if (duration > 0) {
        window.setTimeout(() => {
          dismissToast(toastId);
        }, duration);
      }

      return toastId;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      show: showToast,

      success: (options) =>
        showToast({
          ...options,
          type: "success",
        }),

      error: (options) =>
        showToast({
          ...options,
          type: "error",
        }),

      warning: (options) =>
        showToast({
          ...options,
          type: "warning",
        }),

      info: (options) =>
        showToast({
          ...options,
          type: "info",
        }),

      dismiss: dismissToast,
    }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
}
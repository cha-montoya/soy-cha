import AppShell from "./app/AppShell";

import { ToastProvider } from "./shared/context/ToastContext";

export default function ContentMastermind() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}
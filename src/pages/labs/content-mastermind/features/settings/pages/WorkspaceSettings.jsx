import { useCallback, useEffect, useRef, useState } from "react";

import TextField from "../components/fields/TextField";
import SelectField from "../components/fields/SelectField";
import SaveBar from "../components/SaveBar";
import Spinner from "../../../shared/components/Spinner";
import { ToastViewport } from "../../../shared/components/Toast";

import { useWorkspaceSettings } from "../hooks/useWorkspaceSettings";

const languageOptions = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
];

const timezoneOptions = [
  {
    value: "America/Mexico_City",
    label: "America / Mexico City",
  },
  {
    value: "America/New_York",
    label: "America / New York",
  },
  {
    value: "America/Los_Angeles",
    label: "America / Los Angeles",
  },
  {
    value: "Europe/Madrid",
    label: "Europe / Madrid",
  },
];

function createToastId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function WorkspaceSettings() {
  const {
    workspace,
    isLoading,
    isSaving,
    isDirty,
    error,
    updateField,
    saveChanges,
    cancelChanges,
  } = useWorkspaceSettings();

  const [toasts, setToasts] = useState([]);
  const dismissTimers = useRef(new Map());
  const lastErrorRef = useRef(null);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );

    const timerId = dismissTimers.current.get(toastId);

    if (timerId) {
      window.clearTimeout(timerId);
      dismissTimers.current.delete(toastId);
    }
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = createToastId();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      const timerId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      dismissTimers.current.set(id, timerId);
    },
    [dismissToast]
  );

  useEffect(() => {
    const timers = dismissTimers.current;

    return () => {
      timers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });

      timers.clear();
    };
  }, []);

  useEffect(() => {
    if (!error || error === lastErrorRef.current) {
      return;
    }

    lastErrorRef.current = error;

    showToast({
      type: "error",
      title: "Unable to save",
      message: error,
      duration: 5000,
    });
  }, [error, showToast]);

  const handleSave = async () => {
    const savedWorkspace = await saveChanges();

    if (!savedWorkspace) {
      return;
    }

    lastErrorRef.current = null;

    showToast({
      type: "success",
      title: "Changes saved",
      message: "Workspace settings were updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
      />

      <section className="p-6 lg:p-8">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This information helps personalize AI-generated content for your
            organization.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mt-10 max-w-3xl space-y-10">
          <section>
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                General
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Basic information about this workspace and organization.
              </p>
            </div>

            <div className="mt-6 grid gap-6">
              <TextField
                label="Workspace Name"
                name="workspaceName"
                value={workspace.workspaceName}
                placeholder="Content Mastermind"
                onChange={updateField}
              />

              <TextField
                label="Company Name"
                name="companyName"
                value={workspace.companyName}
                placeholder="Acme Inc."
                onChange={updateField}
              />

              <TextField
                label="Website"
                name="website"
                type="url"
                value={workspace.website}
                placeholder="https://example.com"
                onChange={updateField}
              />

              <TextField
                label="Industry"
                name="industry"
                value={workspace.industry}
                placeholder="Marketing Technology"
                onChange={updateField}
              />
            </div>
          </section>

          <section>
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Regional settings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Used as defaults for generated content, dates and publishing.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <SelectField
                label="Language"
                name="language"
                value={workspace.language}
                options={languageOptions}
                onChange={updateField}
              />

              <SelectField
                label="Time Zone"
                name="timezone"
                value={workspace.timezone}
                options={timezoneOptions}
                onChange={updateField}
              />
            </div>
          </section>
        </div>
      </section>

      <SaveBar
        dirty={isDirty}
        saving={isSaving}
        onCancel={cancelChanges}
        onSave={handleSave}
      />
    </>
  );
}

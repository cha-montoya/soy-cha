import Button from "../../../shared/components/Button";

export default function SaveBar({
  dirty,
  saving,
  onCancel,
  onSave,
}) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {dirty
            ? "You have unsaved changes."
            : "No pending changes."}
        </p>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={!dirty || saving}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!dirty || saving}
            onClick={onSave}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />

                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { routes } from "../../../config/routes";
import { useToast } from "../../../shared/context/ToastContext";
import useSelectedResource from "../../../shared/hooks/useSelectedResource";
import EmptyState from "../../../shared/components/EmptyState";
import SectionLoader from "../../../shared/components/SectionLoader";
import PublicationList from "../components/PublicationList";
import PublicationDetail from "../components/PublicationDetail";
import usePublications from "../hooks/usePublications";
import {
  cancelPublication,
  schedulePublication,
} from "../services/publication.service";

const STATUSES = [
  "all",
  "approved",
  "scheduled",
  "publishing",
  "published",
  "failed",
  "cancelled",
];

export default function Publishing() {
  const [status, setStatus] = useState("all");
  const [busyAction, setBusyAction] = useState("");
  const filters = useMemo(() => ({ status, platform: "linkedin" }), [status]);
  const { publications, loading, error, replacePublication } = usePublications(filters);
  const toast = useToast();

  const {
    selectedResource: selected,
    selectResource: selectPublication,
    invalidSelection,
  } = useSelectedResource(publications, routes.publishing, {
    loading,
    autoSelectFirst: true,
  });

  useEffect(() => {
    if (loading || invalidSelection || !publications.length || !selected) return;

    const selectedIsVisible = publications.some(
      (item) => String(item.id) === String(selected.id)
    );

    if (!selectedIsVisible) {
      selectPublication(publications[0], { replace: true });
    }
  }, [invalidSelection, loading, publications, selected, selectPublication]);

  async function handleSchedule(scheduledAt) {
    try {
      setBusyAction("schedule");
      const updated = await schedulePublication(selected.id, scheduledAt);
      replacePublication(updated);
      toast.success({
        title: "Publication scheduled",
        message: "The LinkedIn publication is now waiting for its scheduled time.",
      });
    } catch (actionError) {
      toast.error({
        title: "Unable to schedule",
        message: actionError.message,
      });
    } finally {
      setBusyAction("");
    }
  }

  async function handleCancel(reason) {
    try {
      setBusyAction("cancel");
      const updated = await cancelPublication(selected.id, reason);
      replacePublication(updated);
      toast.success({
        title: "Publication cancelled",
        message: "The queue record was cancelled successfully.",
      });
    } catch (actionError) {
      toast.error({
        title: "Unable to cancel",
        message: actionError.message,
      });
    } finally {
      setBusyAction("");
    }
  }

  if (loading) return <SectionLoader text="Loading publication queue..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load Publishing"
        description={error.message || "An unexpected error occurred."}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 gap-6">
      <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h1 className="font-display text-xl font-black tracking-tight">Publishing</h1>
          <p className="mt-1 text-sm text-gray-500">
            {publications.length} LinkedIn publication{publications.length === 1 ? "" : "s"}
          </p>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value === "all" ? "All statuses" : value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <PublicationList
            publications={publications}
            selected={selected}
            onSelect={selectPublication}
          />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto rounded-xl border border-gray-200 bg-white">
        {invalidSelection ? (
          <EmptyState
            title="Publication not found"
            description="The selected publication does not exist or is no longer available."
          />
        ) : selected ? (
          <PublicationDetail
            key={selected.id}
            publication={selected}
            busyAction={busyAction}
            onSchedule={handleSchedule}
            onCancel={handleCancel}
          />
        ) : (
          <EmptyState
            title="Publication queue is empty"
            description="Approve content and send it to Publishing from Image Studio."
          />
        )}
      </main>
    </div>
  );
}

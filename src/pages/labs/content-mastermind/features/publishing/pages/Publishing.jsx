import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { routes } from "../../../config/routes";
import { useToast } from "../../../shared/context/ToastContext";
import useSelectedResource from "../../../shared/hooks/useSelectedResource";
import EmptyState from "../../../shared/components/EmptyState";
import SectionLoader from "../../../shared/components/SectionLoader";
import PageHeader from "../../../shared/components/PageHeader";
import { ClearFiltersButton, DateInput, FilterPanel, SearchInput, SelectInput } from "../../../shared/components/filters/FilterControls";
import { isWithinDateRange, matchesSearch } from "../../../shared/utils/filters";
import PublicationList from "../components/PublicationList";
import PublicationDetail from "../components/PublicationDetail";
import usePublications from "../hooks/usePublications";
import {
  cancelPublication,
  schedulePublication,
  publishPublication,
  getLinkedInStatus,
  getLinkedInAuthorizationUrl,
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
  const [linkedInStatus, setLinkedInStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => ({ status, platform: "linkedin" }), [status]);
  const { publications, loading, error, replacePublication } = usePublications(filters);
  const toast = useToast();

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const content = publication.generated_content || {};
      return (
        matchesSearch(
          [content.title, content.content, publication.platform, publication.status],
          search
        ) &&
        isWithinDateRange(
          publication.published_at || publication.scheduled_at || publication.created_at,
          from,
          to
        )
      );
    });
  }, [from, publications, search, to]);

  const {
    selectedResource: selected,
    selectResource: selectPublication,
    invalidSelection,
  } = useSelectedResource(publications, routes.publishing, {
    loading,
    autoSelectFirst: true,
  });


  useEffect(() => {
    let active = true;

    getLinkedInStatus()
      .then((integration) => {
        if (active) setLinkedInStatus(integration);
      })
      .catch((statusError) => {
        if (active) {
          setLinkedInStatus({ connected: false });
          toast.error({
            title: "Unable to read LinkedIn connection",
            message: statusError.message,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [toast]);

  useEffect(() => {
    const result = searchParams.get("linkedin");
    if (!result) return;

    if (result === "connected") {
      toast.success({
        title: "LinkedIn connected",
        message: "Publish now is ready to use.",
      });
      getLinkedInStatus().then(setLinkedInStatus).catch(() => {});
    } else if (result === "error") {
      toast.error({
        title: "LinkedIn connection failed",
        message: searchParams.get("message") || "The authorization could not be completed.",
      });
    }

    const next = new URLSearchParams(searchParams);
    next.delete("linkedin");
    next.delete("message");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams, toast]);

  useEffect(() => {
    if (loading || invalidSelection || !filteredPublications.length || !selected) return;

    const selectedIsVisible = filteredPublications.some(
      (item) => String(item.id) === String(selected.id)
    );

    if (!selectedIsVisible) {
      selectPublication(filteredPublications[0], { replace: true });
    }
  }, [filteredPublications, invalidSelection, loading, selected, selectPublication]);


  async function handleConnectLinkedIn() {
    try {
      setBusyAction("connect");
      const authorizationUrl = await getLinkedInAuthorizationUrl();
      window.location.assign(authorizationUrl);
    } catch (actionError) {
      toast.error({
        title: "Unable to connect LinkedIn",
        message: actionError.message,
      });
      setBusyAction("");
    }
  }

  async function handlePublish() {
    try {
      setBusyAction("publish");
      const updated = await publishPublication(selected.id);
      replacePublication(updated);
      toast.success({
        title: "Published on LinkedIn",
        message: "The post was published successfully.",
      });
    } catch (actionError) {
      toast.error({
        title: "LinkedIn publication failed",
        message: actionError.message,
      });
    } finally {
      setBusyAction("");
    }
  }

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <PageHeader
        title="Publishing"
        description="Review, schedule and publish LinkedIn content from one consistent queue."
        meta={<span className="text-sm font-medium text-slate-500">{filteredPublications.length} of {publications.length}</span>}
      />

      <FilterPanel>
        <SearchInput value={search} onChange={setSearch} placeholder="Search publication title or copy..." />
        <SelectInput
          label="Status"
          value={status}
          onChange={setStatus}
          options={STATUSES.map((value) => ({
            value,
            label: value === "all" ? "All statuses" : value.replaceAll("_", " "),
          }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <DateInput label="From" value={from} onChange={setFrom} />
          <DateInput label="To" value={to} onChange={setTo} />
        </div>
        <div className="flex items-end">
          <ClearFiltersButton
            disabled={!search && status === "all" && !from && !to}
            onClick={() => {
              setSearch("");
              setStatus("all");
              setFrom("");
              setTo("");
            }}
          />
        </div>
      </FilterPanel>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r">
          <PublicationList
            publications={filteredPublications}
            selected={selected}
            onSelect={selectPublication}
          />
        </aside>

        <main className="min-w-0 overflow-auto bg-slate-50/40">
          {invalidSelection ? (
            <EmptyState
              title="Publication not found"
              description="The selected publication does not exist or is no longer available."
            />
          ) : selected && filteredPublications.length ? (
            <PublicationDetail
              key={selected.id}
              publication={selected}
              busyAction={busyAction}
              onSchedule={handleSchedule}
              onCancel={handleCancel}
              onPublish={handlePublish}
              linkedInStatus={linkedInStatus}
              onConnectLinkedIn={handleConnectLinkedIn}
            />
          ) : (
            <EmptyState
              title={publications.length ? "No matching publications" : "Publication queue is empty"}
              description={publications.length ? "Change or clear the current filters." : "Approve content and send it to Publishing from Image Studio."}
            />
          )}
        </main>
      </div>
    </div>
  );
}

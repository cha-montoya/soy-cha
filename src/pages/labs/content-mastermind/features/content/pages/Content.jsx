import { useEffect, useMemo, useState } from "react";

import { routes } from "../../../config/routes";
import useSelectedResource from "../../../shared/hooks/useSelectedResource";
import EmptyState from "../../../shared/components/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import SectionLoader from "../../../shared/components/SectionLoader";
import {
  ClearFiltersButton,
  DateInput,
  FilterPanel,
  SearchInput,
  SelectInput,
} from "../../../shared/components/filters/FilterControls";
import {
  isWithinDateRange,
  matchesSearch,
  uniqueOptions,
} from "../../../shared/utils/filters";

import useContent from "../hooks/useContent";
import ContentList from "../components/ContentList";
import ContentDetail from "../components/ContentDetail";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "image_ready", label: "Image ready" },
  { value: "pending_review", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  source: "all",
  topic: "all",
  from: "",
  to: "",
};

function matchesStatus(content, status) {
  if (status === "all") return true;
  if (status === "image_ready") {
    return content.image_status === "ready" || content.image_status === "generated";
  }
  if (status === "pending_review") return content.review_status === "pending";
  if (status === "approved") {
    return content.status === "approved" || content.review_status === "approved";
  }
  return content.status === status;
}

export default function Content() {
  const { contents, loading, error, replaceContent } = useContent();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const {
    selectedResource: selectedContent,
    selectResource: selectContent,
    invalidSelection,
  } = useSelectedResource(contents, routes.content, {
    loading,
    autoSelectFirst: true,
  });

  const sourceOptions = useMemo(
    () => uniqueOptions(contents, (item) => item.source_name, "All sources"),
    [contents]
  );
  const topicOptions = useMemo(
    () => uniqueOptions(contents, (item) => item.topic, "All topics"),
    [contents]
  );

  const filteredContents = useMemo(() => {
    return contents
      .filter((content) => {
        return (
          matchesStatus(content, filters.status) &&
          (filters.source === "all" || content.source_name === filters.source) &&
          (filters.topic === "all" || content.topic === filters.topic) &&
          isWithinDateRange(content.created_at, filters.from, filters.to) &&
          matchesSearch(
            [content.title, content.content, content.article_title, content.topic, ...(content.hashtags || [])],
            filters.search
          )
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [contents, filters]);

  useEffect(() => {
    if (loading || invalidSelection || !filteredContents.length || !selectedContent) return;
    if (!filteredContents.some((item) => item.id === selectedContent.id)) {
      selectContent(filteredContents[0], { replace: true });
    }
  }, [filteredContents, invalidSelection, loading, selectedContent, selectContent]);

  const filtersActive = filters.search || filters.status !== "all" || filters.source !== "all" || filters.topic !== "all" || filters.from || filters.to;

  if (loading) return <SectionLoader text="Loading generated content..." />;
  if (error) return <EmptyState title="Unable to load generated content" description={error?.message || "An unexpected error occurred."} />;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <PageHeader
        title="Content"
        description="Search and review drafts using the same editorial context available in Analysis."
        meta={<span className="text-sm font-medium text-slate-500">{filteredContents.length} of {contents.length}</span>}
      />

      <FilterPanel>
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilters((current) => ({ ...current, search }))}
          placeholder="Search title, copy, topic or hashtag..."
        />
        <SelectInput label="Status" value={filters.status} onChange={(status) => setFilters((current) => ({ ...current, status }))} options={STATUS_OPTIONS} />
        <SelectInput label="Source" value={filters.source} onChange={(source) => setFilters((current) => ({ ...current, source }))} options={sourceOptions} />
        <SelectInput label="Topic" value={filters.topic} onChange={(topic) => setFilters((current) => ({ ...current, topic }))} options={topicOptions} />
        <div className="grid grid-cols-2 gap-3 xl:col-span-3">
          <DateInput label="From" value={filters.from} onChange={(from) => setFilters((current) => ({ ...current, from }))} />
          <DateInput label="To" value={filters.to} onChange={(to) => setFilters((current) => ({ ...current, to }))} />
        </div>
        <div className="flex items-end">
          <ClearFiltersButton onClick={() => setFilters(INITIAL_FILTERS)} disabled={!filtersActive} />
        </div>
      </FilterPanel>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r">
          <ContentList contents={filteredContents} selectedContent={selectedContent} onSelect={selectContent} />
        </aside>
        <main className="min-h-0 overflow-y-auto bg-slate-50/40">
          {invalidSelection ? (
            <EmptyState title="Content not found" description="The selected content no longer exists." />
          ) : filteredContents.length === 0 ? (
            <EmptyState title="No matching content" description="Change or clear the current filters." />
          ) : (
            <ContentDetail content={selectedContent} onContentUpdated={replaceContent} />
          )}
        </main>
      </div>
    </div>
  );
}

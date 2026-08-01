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
import { useToast } from "../../../shared/context/ToastContext";

import useAnalysis from "../hooks/useAnalysis";
import AnalysisList from "../components/AnalysisList";
import AnalysisDetail from "../components/AnalysisDetail";
import { generateContent } from "../../content/services/content-generator.service";

const INITIAL_FILTERS = {
  search: "",
  source: "all",
  topic: "all",
  from: "",
  to: "",
};

export default function Analysis() {
  const { analysis, loading, error } = useAnalysis();
  const toast = useToast();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    selectedResource: selectedAnalysis,
    selectResource: selectAnalysis,
    invalidSelection,
  } = useSelectedResource(analysis, routes.analysis, {
    loading,
    autoSelectFirst: true,
  });

  const sourceOptions = useMemo(
    () => uniqueOptions(analysis, (item) => item.source_name, "All sources"),
    [analysis]
  );
  const topicOptions = useMemo(
    () => uniqueOptions(analysis, (item) => item.topic, "All topics"),
    [analysis]
  );

  const filteredAnalysis = useMemo(() => {
    return analysis.filter((item) => {
      const matchesSource =
        filters.source === "all" || item.source_name === filters.source;
      const matchesTopic =
        filters.topic === "all" || item.topic === filters.topic;
      const matchesDate = isWithinDateRange(
        item.analyzed_at || item.created_at,
        filters.from,
        filters.to
      );
      const matchesText = matchesSearch(
        [
          item.article_title,
          item.summary,
          item.topic,
          item.target_audience,
          ...(Array.isArray(item.keywords) ? item.keywords : []),
        ],
        filters.search
      );

      return matchesSource && matchesTopic && matchesDate && matchesText;
    });
  }, [analysis, filters]);

  useEffect(() => {
    if (loading || invalidSelection || !filteredAnalysis.length || !selectedAnalysis) {
      return;
    }

    if (!filteredAnalysis.some((item) => item.id === selectedAnalysis.id)) {
      selectAnalysis(filteredAnalysis[0], { replace: true });
    }
  }, [filteredAnalysis, invalidSelection, loading, selectedAnalysis, selectAnalysis]);

  const filtersActive = Object.values(filters).some(Boolean) &&
    (filters.search || filters.source !== "all" || filters.topic !== "all" || filters.from || filters.to);

  async function handleGenerate(analysisId) {
    if (!analysisId || isGenerating) return;
    setIsGenerating(true);

    try {
      await generateContent(analysisId);
      toast.success({
        title: "Content generated",
        message: "The LinkedIn draft was generated and is ready for review.",
      });
    } catch (generationError) {
      toast.error({
        title: "Generation failed",
        message: generationError?.message || "Unable to generate the LinkedIn draft.",
        duration: 7000,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  if (loading) return <SectionLoader text="Loading article analysis..." />;

  if (error) {
    return (
      <EmptyState
        title="Unable to load analysis"
        description={error?.message || "An unexpected error occurred while loading the analysis."}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <PageHeader
        title="Analysis"
        description="Review AI analysis by source, topic and analysis date before generating content."
        meta={<span className="text-sm font-medium text-slate-500">{filteredAnalysis.length} of {analysis.length}</span>}
      />

      <FilterPanel>
        <SearchInput
          value={filters.search}
          onChange={(search) => setFilters((current) => ({ ...current, search }))}
          placeholder="Search title, summary, topic or keyword..."
        />
        <SelectInput
          label="Source"
          value={filters.source}
          onChange={(source) => setFilters((current) => ({ ...current, source }))}
          options={sourceOptions}
        />
        <SelectInput
          label="Topic"
          value={filters.topic}
          onChange={(topic) => setFilters((current) => ({ ...current, topic }))}
          options={topicOptions}
        />
        <ClearFiltersButton onClick={() => setFilters(INITIAL_FILTERS)} disabled={!filtersActive} />
        <div className="grid grid-cols-2 gap-3 xl:col-span-4 xl:max-w-md">
          <DateInput label="From" value={filters.from} onChange={(from) => setFilters((current) => ({ ...current, from }))} />
          <DateInput label="To" value={filters.to} onChange={(to) => setFilters((current) => ({ ...current, to }))} />
        </div>
      </FilterPanel>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r">
          <AnalysisList
            analysis={filteredAnalysis}
            selectedAnalysis={selectedAnalysis}
            onSelect={selectAnalysis}
          />
        </aside>

        <main className="min-h-0 overflow-y-auto bg-slate-50/40">
          {invalidSelection ? (
            <EmptyState title="Analysis not found" description="The selected analysis no longer exists." />
          ) : filteredAnalysis.length === 0 ? (
            <EmptyState title="No matching analysis" description="Change or clear the current filters." />
          ) : (
            <AnalysisDetail
              analysis={selectedAnalysis}
              onGenerate={handleGenerate}
              generating={isGenerating}
            />
          )}
        </main>
      </div>
    </div>
  );
}

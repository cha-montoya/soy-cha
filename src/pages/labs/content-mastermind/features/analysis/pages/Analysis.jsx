import { useEffect, useMemo, useState } from "react";

import { routes } from "../../../config/routes";
import useSelectedResource from "../../../shared/hooks/useSelectedResource";

import useAnalysis from "../hooks/useAnalysis";

import SearchBar from "../../content/components/SearchBar";

import AnalysisList from "../components/AnalysisList";
import AnalysisDetail from "../components/AnalysisDetail";

import EmptyState from "../../../shared/components/EmptyState";
import SectionLoader from "../../../shared/components/SectionLoader";

import { useToast } from "../../../shared/context/ToastContext";

import { generateContent } from "../../content/services/content-generator.service";

export default function Analysis() {
  const { analysis, loading, error } = useAnalysis();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    selectedResource: selectedAnalysis,
    selectResource: selectAnalysis,
    invalidSelection,
  } = useSelectedResource(analysis, routes.analysis, {
    loading,
    autoSelectFirst: true,
  });

  const filteredAnalysis = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return analysis.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        item.summary,
        item.topic,
        item.target_audience,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [analysis, search]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (invalidSelection) {
      return;
    }

    if (!filteredAnalysis.length) {
      return;
    }

    if (!selectedAnalysis) {
      return;
    }

    const selectedIsVisible = filteredAnalysis.some(
      (item) => item.id === selectedAnalysis.id
    );

    if (!selectedIsVisible) {
      selectAnalysis(filteredAnalysis[0], {
        replace: true,
      });
    }
  }, [
    filteredAnalysis,
    invalidSelection,
    loading,
    selectedAnalysis,
    selectAnalysis,
  ]);

  const handleGenerate = async (analysisId) => {
    if (!analysisId || isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      await generateContent(analysisId);

      toast.success({
        title: "Content generated",
        message:
          "The LinkedIn draft was generated successfully and is ready for review.",
      });
    } catch (generationError) {
      toast.error({
        title: "Generation failed",
        message:
          generationError?.message ||
          "An error occurred while generating the LinkedIn draft.",
        duration: 7000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <SectionLoader text="Loading article analysis..." />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load analysis"
        description={
          error?.message ||
          "An unexpected error occurred while loading the analysis."
        }
      />
    );
  }

  return (
    <div className="flex h-full gap-6">
      <div className="flex w-1/3 flex-col">
        <div className="mb-3">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <p className="mb-3 text-sm text-gray-500">
          {filteredAnalysis.length} artículo
          {filteredAnalysis.length !== 1 ? "s" : ""}
        </p>

        <div className="flex-1 overflow-auto rounded-lg border">
          <AnalysisList
            analysis={filteredAnalysis}
            selectedAnalysis={selectedAnalysis}
            onSelect={selectAnalysis}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border">
        {invalidSelection ? (
          <EmptyState
            title="Analysis not found"
            description="The selected analysis does not exist or is no longer available."
          />
        ) : (
          <AnalysisDetail
            analysis={selectedAnalysis}
            onGenerate={handleGenerate}
            generating={isGenerating}
          />
        )}
      </div>
    </div>
  );
}
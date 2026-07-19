import { useEffect, useMemo, useState } from "react";

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

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredAnalysis = useMemo(() => {
    return analysis.filter((item) => {
      const text = `
        ${item.summary || ""}
        ${item.topic || ""}
        ${item.target_audience || ""}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [analysis, search]);

  useEffect(() => {
    if (!filteredAnalysis.length) {
      setSelectedAnalysis(null);
      return;
    }

    const selectedStillExists = filteredAnalysis.some(
      (item) => item.id === selectedAnalysis?.id
    );

    if (!selectedStillExists) {
      setSelectedAnalysis(filteredAnalysis[0]);
    }
  }, [filteredAnalysis, selectedAnalysis]);

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
        description={error.message}
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
            onSelect={setSelectedAnalysis}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border">
        <AnalysisDetail
          analysis={selectedAnalysis}
          onGenerate={handleGenerate}
          generating={isGenerating}
        />
      </div>
    </div>
  );
}
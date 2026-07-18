import { useEffect, useMemo, useState } from "react";

import useAnalysis from "../hooks/useAnalysis";

import SearchBar from "../../content/components/SearchBar";

import AnalysisList from "../components/AnalysisList";
import AnalysisDetail from "../components/AnalysisDetail";

import EmptyState from "../../../shared/components/EmptyState";
import Spinner from "../../../shared/components/Spinner";
import SectionLoader from "../../../shared/components/SectionLoader";

import { generateContent } from "../../content/services/content-generator.service";

export default function Analysis() {
  const { analysis, loading, error } = useAnalysis();

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [search, setSearch] = useState("");

  const filteredAnalysis = useMemo(() => {
    return analysis.filter((item) => {
      const text = `
        ${item.summary}
        ${item.topic}
        ${item.target_audience}
      `.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [analysis, search]);

  useEffect(() => {
    if (!filteredAnalysis.length) {
      setSelectedAnalysis(null);
      return;
    }

    const exists = filteredAnalysis.find(
      (item) => item.id === selectedAnalysis?.id
    );

    if (!exists) {
      setSelectedAnalysis(filteredAnalysis[0]);
    }
  }, [filteredAnalysis, selectedAnalysis]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (analysisId) => {

      setIsGenerating(true);

      try {

          await generateContent(analysisId);

          alert("LinkedIn draft generated successfully.");

      } catch (error) {

          alert(error.message);

      } finally {

          setIsGenerating(false);

      }

  };

  if (loading) {
      return (
          <SectionLoader
              text="Loading article analysis..."
          />
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
    <div className="flex gap-6 h-full">

      <div className="w-1/3 flex flex-col">

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

        <div className="border rounded-lg overflow-auto flex-1">

          <AnalysisList
            analysis={filteredAnalysis}
            selectedAnalysis={selectedAnalysis}
            onSelect={setSelectedAnalysis}
          />

        </div>

      </div>

      <div className="flex-1 border rounded-lg overflow-auto">

        <AnalysisDetail
          analysis={selectedAnalysis}
          onGenerate={handleGenerate}
          generating={isGenerating}
        />

      </div>

    </div>
  );
}
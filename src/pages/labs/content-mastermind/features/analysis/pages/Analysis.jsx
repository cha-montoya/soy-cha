import { useEffect, useMemo, useState } from "react";

import useAnalysis from "../hooks/useAnalysis";

import SearchBar from "../../content/components/SearchBar";
import AnalysisList from "../components/AnalysisList";
import AnalysisDetail from "../components/AnalysisDetail";
import EmptyState from "../../../shared/components/EmptyState";
import Spinner from "../../../shared/components/Spinner";

export default function Analysis() {
  const { analysis, loading, error } = useAnalysis();

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [search, setSearch] = useState("");

  const filteredAnalysis = useMemo(() => {
    return analysis.filter((item) =>
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.toLowerCase().includes(search.toLowerCase()) ||
      item.target_audience.toLowerCase().includes(search.toLowerCase())
    );
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

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size={32} />
      </div>
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
          {filteredAnalysis.length} article
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
        />

      </div>

    </div>
  );
}
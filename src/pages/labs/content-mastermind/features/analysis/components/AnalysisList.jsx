import AnalysisListItem from "./AnalysisListItem";
import EmptyState from "../../../shared/components/EmptyState";

export default function AnalysisList({
  analysis,
  selectedAnalysis,
  onSelect,
}) {
  if (!analysis.length) {
    return (
      <EmptyState
        title="No analysis found"
        description="Try another search."
      />
    );
  }

  return (
    <div>
      {analysis.map((item) => (
        <AnalysisListItem
          key={item.id}
          analysis={item}
          selected={selectedAnalysis?.id === item.id}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  );
}
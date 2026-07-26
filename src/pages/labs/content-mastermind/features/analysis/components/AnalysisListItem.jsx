import ResourceListItem from "../../../shared/components/ResourceListItem";

export default function AnalysisListItem({
  analysis,
  selected,
  onClick,
}) {
  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      title={analysis.summary}
      meta={
        <div className="flex items-center justify-between gap-3">
          <span className="truncate">{analysis.target_audience}</span>
          <span className="shrink-0">{analysis.confidence_score}/10</span>
        </div>
      }
    >
      {analysis.topic && (
        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
          {analysis.topic}
        </p>
      )}
    </ResourceListItem>
  );
}

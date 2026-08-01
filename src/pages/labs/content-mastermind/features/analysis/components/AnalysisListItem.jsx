import ResourceListItem from "../../../shared/components/ResourceListItem";
import Badge from "../../../shared/components/Badge";
import { formatDate } from "../../../shared/utils/filters";

export default function AnalysisListItem({ analysis, selected, onClick }) {
  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      title={analysis.article_title || analysis.summary || "Untitled analysis"}
      badge={analysis.relevance_score != null ? <Badge variant="info">{analysis.relevance_score}/10</Badge> : null}
      meta={
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-slate-600">{analysis.source_name || "Unknown source"}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(analysis.analyzed_at || analysis.created_at)}</span>
        </div>
      }
    >
      {analysis.topic ? (
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{analysis.topic}</p>
      ) : null}
    </ResourceListItem>
  );
}

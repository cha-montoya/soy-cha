import ResourceListItem from "../../../shared/components/ResourceListItem";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../../shared/utils/filters";

export default function ContentListItem({ content, selected, onClick }) {
  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      title={content.title || "Untitled content"}
      badge={<StatusBadge status={content.status} />}
      meta={
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-slate-600">{content.source_name || "Unknown source"}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(content.created_at)}</span>
        </div>
      }
    >
      {content.topic ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{content.topic}</p> : null}
    </ResourceListItem>
  );
}

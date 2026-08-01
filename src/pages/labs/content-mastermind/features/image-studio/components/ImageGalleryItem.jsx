import ResourceListItem from "../../../shared/components/ResourceListItem";
import StatusBadge from "../../../shared/components/StatusBadge";
import { formatDate } from "../../../shared/utils/filters";

export default function ImageGalleryItem({ content, selected = false, onClick }) {
  const hasImage = Boolean(content.image_url);
  const imageStatus = content.image_status || (hasImage ? "generated" : "not_generated");

  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      leading={
        <div className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {hasImage ? (
            <img src={content.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400">No image</div>
          )}
        </div>
      }
      title={content.title || "Untitled content"}
      badge={<StatusBadge value={imageStatus} />}
      meta={`${content.source_name || "Unknown source"} · ${formatDate(content.image_generated_at || content.created_at)}`}
    >
      {content.topic ? <p className="mt-1 line-clamp-1 text-xs text-slate-500">{content.topic}</p> : null}
    </ResourceListItem>
  );
}

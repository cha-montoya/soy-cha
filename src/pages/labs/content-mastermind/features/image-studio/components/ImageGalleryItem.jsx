import ResourceListItem from "../../../shared/components/ResourceListItem";
import StatusBadge from "../../../shared/components/StatusBadge";

export default function ImageGalleryItem({
  content,
  selected = false,
  onClick,
}) {
  const hasImage = Boolean(content.image_url);
  const imageStatus =
    content.image_status ||
    (hasImage ? "generated" : "not_generated");

  const thumbnail = (
    <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
      {hasImage ? (
        <img
          src={content.image_url}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-medium uppercase tracking-wide text-gray-400">
          No image
        </div>
      )}
    </div>
  );

  const badge = <StatusBadge value={imageStatus} />;

  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      leading={thumbnail}
      title={content.title || "Untitled content"}
      badge={badge}
    />
  );
}

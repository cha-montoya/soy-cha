import ResourceListItem from "../../../shared/components/ResourceListItem";

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

  const badge = (
    <span
      className={[
        "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
        hasImage
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-500",
      ].join(" ")}
    >
      {formatStatus(imageStatus)}
    </span>
  );

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

function formatStatus(status) {
  return String(status || "unknown")
    .replaceAll("_", " ")
    .trim();
}

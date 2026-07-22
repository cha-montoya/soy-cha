export default function ImageGalleryItem({
  content,
  selected = false,
  onClick,
}) {
  const hasImage = Boolean(content.image_url);

  const imageStatus =
    content.image_status ||
    (hasImage ? "generated" : "not_generated");

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full border-b p-3 text-left transition-colors",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-inset focus-visible:ring-gray-900",
        selected
          ? "bg-gray-100"
          : "bg-white hover:bg-gray-50",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
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

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900">
            {content.title || "Untitled content"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={[
                "rounded-full px-2 py-1 text-[10px]",
                "font-semibold uppercase tracking-wide",
                hasImage
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500",
              ].join(" ")}
            >
              {formatStatus(imageStatus)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function formatStatus(status) {
  return String(status || "unknown")
    .replaceAll("_", " ")
    .trim();
}
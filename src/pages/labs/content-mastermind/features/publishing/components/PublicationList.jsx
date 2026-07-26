function formatDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PublicationList({ publications, selected, onSelect }) {
  if (!publications.length) {
    return (
      <div className="p-6 text-sm text-gray-500">
        No publication records match this filter.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {publications.map((publication) => {
        const content = publication.generated_content || {};
        const active = String(publication.id) === String(selected?.id);

        return (
          <button
            key={publication.id}
            type="button"
            onClick={() => onSelect(publication)}
            className={`w-full p-4 text-left transition ${
              active ? "bg-black text-white" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 font-semibold">
                {content.title || "Untitled publication"}
              </p>
              <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {String(publication.status || "unknown").replaceAll("_", " ")}
              </span>
            </div>

            <p className={`mt-2 text-xs ${active ? "text-gray-300" : "text-gray-500"}`}>
              {publication.platform} · {formatDate(publication.scheduled_at)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

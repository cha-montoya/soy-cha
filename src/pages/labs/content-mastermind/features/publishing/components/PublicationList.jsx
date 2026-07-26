import ResourceListItem from "../../../shared/components/ResourceListItem";

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
    <div>
      {publications.map((publication) => {
        const content = publication.generated_content || {};
        const active = String(publication.id) === String(selected?.id);

        const badge = (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">
            {String(publication.status || "unknown").replaceAll("_", " ")}
          </span>
        );

        return (
          <ResourceListItem
            key={publication.id}
            selected={active}
            onClick={() => onSelect(publication)}
            title={content.title || "Untitled publication"}
            badge={badge}
            meta={
              <span>
                {publication.platform} · {formatDate(publication.scheduled_at)}
              </span>
            }
          />
        );
      })}
    </div>
  );
}

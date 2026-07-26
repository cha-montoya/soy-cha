import ResourceListItem from "../../../shared/components/ResourceListItem";
import StatusBadge from "./StatusBadge";

export default function ContentListItem({
  content,
  selected,
  onClick,
}) {
  return (
    <ResourceListItem
      selected={selected}
      onClick={onClick}
      title={content.title}
      badge={<StatusBadge status={content.status} />}
      meta={new Date(content.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })}
    />
  );
}

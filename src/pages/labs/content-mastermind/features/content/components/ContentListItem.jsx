import StatusBadge from "./StatusBadge";

export default function ContentListItem({
  content,
  selected,
  onClick,
}) {

  return (

    <div
      onClick={onClick}
      className={`
          p-4
          border-b
          cursor-pointer
          transition-all

          ${
            selected
              ? "bg-slate-50 border-l-4 border-l-slate-600"
              : "hover:bg-gray-50 border-l-4 border-l-transparent"
          }
      `}
    >

      <h3 className="font-semibold line-clamp-2">

        {content.title}

      </h3>

      <div className="mt-2">

        <StatusBadge status={content.status} />

        <p className="mt-2 text-xs text-gray-500">
          {new Date(content.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
        </p>

      </div>

    </div>

  );

}
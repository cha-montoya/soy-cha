import { ImageIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import StatusBadge from "../../../shared/components/StatusBadge";

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatStatus(value) {
  if (!value) {
    return "Draft";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function RecentContent({ items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Recent content
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest AI-generated content records.
          </p>
        </div>

        <Link
          to="/labs/content-mastermind/content"
          className="text-sm font-semibold text-slate-700 transition hover:text-slate-950"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-medium text-slate-600">
            No generated content yet.
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Generated records will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    size={24}
                    weight="regular"
                    className="text-slate-400"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {item.title || "Untitled content"}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                  {item.content || "No content preview available."}
                </p>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 sm:block sm:text-right">
                <StatusBadge value={item.status} />

                <p className="mt-0 text-xs text-slate-400 sm:mt-2">
                  {formatDate(item.created_at)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
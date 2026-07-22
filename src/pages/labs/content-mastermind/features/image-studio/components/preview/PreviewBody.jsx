import { useMemo, useState } from "react";

const COLLAPSED_LENGTH = 420;

export default function PreviewBody({
  body = "",
  hashtags = [],
}) {
  const [expanded, setExpanded] = useState(false);

  const normalizedBody = String(body || "").trim();

  const normalizedHashtags = useMemo(() => {
    if (!Array.isArray(hashtags)) {
      return [];
    }

    return hashtags
      .map((hashtag) =>
        String(hashtag || "")
          .trim()
          .replace(/^#/, "")
      )
      .filter(Boolean);
  }, [hashtags]);

  const shouldCollapse =
    normalizedBody.length > COLLAPSED_LENGTH;

  const visibleBody =
    shouldCollapse && !expanded
      ? `${normalizedBody.slice(0, COLLAPSED_LENGTH).trim()}…`
      : normalizedBody;

  return (
    <div className="space-y-4">
      <div>
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-gray-800">
          {visibleBody || "No post copy generated yet."}
        </p>

        {shouldCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {normalizedHashtags.length > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {normalizedHashtags.map((hashtag, index) => (
            <span
              key={`${hashtag}-${index}`}
              className="text-sm font-semibold text-blue-700"
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
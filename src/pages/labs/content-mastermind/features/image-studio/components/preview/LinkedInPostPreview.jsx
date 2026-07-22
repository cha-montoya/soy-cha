import {
  CheckCircleIcon,
  ImageIcon,
  TextAaIcon,
} from "@phosphor-icons/react";

import PreviewHeader from "./PreviewHeader";
import PreviewBody from "./PreviewBody";
import PreviewImage from "./PreviewImage";
import PreviewFooter from "./PreviewFooter";

export default function LinkedInPostPreview({
  title = "",
  body = "",
  hashtags = [],
  imageUrl = null,
  generating = false,
  authorName = "Content Mastermind",
  authorRole = "AI Content Workspace",
  authorImage = null,
  compact = false,
}) {
  const characterCount = String(body || "").length;
  const hashtagCount = Array.isArray(hashtags)
    ? hashtags.length
    : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        className={[
          "flex flex-wrap items-center justify-between gap-3 border-b border-gray-200",
          compact
            ? "px-5 py-3"
            : "px-6 py-4",
        ].join(" ")}
      >
        <div>
          <p className="text-sm font-bold text-gray-900">
            Post Preview
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            Editorial representation for LinkedIn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PreviewMetric
            icon={TextAaIcon}
            label={`${characterCount} characters`}
            valid={characterCount > 0}
          />

          <PreviewMetric
            icon={ImageIcon}
            label={imageUrl ? "Image ready" : "No image"}
            valid={Boolean(imageUrl)}
          />

          <PreviewMetric
            icon={CheckCircleIcon}
            label={`${hashtagCount} hashtags`}
            valid={hashtagCount > 0}
          />
        </div>
      </div>

      <div
        className={[
          compact ? "space-y-4 p-5" : "space-y-6 p-6",
        ].join(" ")}
      >
        <PreviewHeader
          authorName={authorName}
          authorRole={authorRole}
          authorImage={authorImage}
          channel="LinkedIn"
        />

        <div className="border-t border-gray-100" />

        <PreviewBody
          body={body}
          hashtags={hashtags}
        />

        <PreviewImage
          imageUrl={imageUrl}
          title={title}
          generating={generating}
          compact={compact}
        />

        <PreviewFooter />
      </div>
    </section>
  );
}

function PreviewMetric({
  icon: Icon,
  label,
  valid = false,
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-[11px] font-semibold",
        valid
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-500",
      ].join(" ")}
    >
      <Icon
        size={14}
        weight={valid ? "fill" : "regular"}
      />

      {label}
    </span>
  );
}
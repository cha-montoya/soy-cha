import Button from "../../../shared/components/Button";
import Spinner from "../../../shared/components/Spinner";

export default function ImageInspector({
  content,
  generating = false,
  error = "",
  onGenerate,
}) {
  if (!content) {
    return (
      <div className="flex min-h-64 items-center justify-center p-8 text-center text-sm text-gray-500">
        Select a content item to inspect its image configuration.
      </div>
    );
  }

  const hasImage = Boolean(content.image_url);

  const buttonLabel = generating
    ? "Generating..."
    : hasImage
      ? "Regenerate Image"
      : "Generate Image";

  const metadata = normalizeMetadata(content.image_metadata);

  return (
    <div className="divide-y divide-gray-200">
      <section className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Content
        </p>

        <h1 className="mt-2 text-lg font-bold leading-6 text-gray-900">
          {content.title || "Untitled content"}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge
            value={content.image_status}
            fallback={hasImage ? "generated" : "not generated"}
          />

          {content.review_status && (
            <StatusBadge value={content.review_status} />
          )}
        </div>
      </section>

      <section className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Image Prompt
        </p>

        <div className="mt-3 rounded-lg bg-gray-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
            {content.image_prompt ||
              "No image prompt is available for this content."}
          </p>
        </div>
      </section>

      <section className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Generation
        </p>

        <dl className="mt-4 space-y-3">
          <MetadataRow
            label="Provider"
            value={
              metadata.provider ||
              content.ai_provider ||
              "—"
            }
          />

          <MetadataRow
            label="Model"
            value={
              content.image_model ||
              metadata.model ||
              "—"
            }
          />

          <MetadataRow
            label="Dimensions"
            value={formatDimensions(metadata)}
          />

          <MetadataRow
            label="File size"
            value={formatFileSize(metadata.size_bytes)}
          />

          <MetadataRow
            label="Channel"
            value={metadata.channel || "—"}
          />

          <MetadataRow
            label="Generated"
            value={formatDate(
              content.image_generated_at ||
                metadata.generated_at
            )}
          />
        </dl>
      </section>

      <section className="p-5">
        <Button
          onClick={onGenerate}
          disabled={
            generating ||
            !content.id ||
            !content.image_prompt
          }
        >
          <div className="flex items-center justify-center gap-2">
            {generating && <Spinner size={16} />}

            <span>{buttonLabel}</span>
          </div>
        </Button>

        {!content.image_prompt && (
          <p className="mt-3 text-xs leading-5 text-amber-700">
            An image prompt is required before generating an image.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function MetadataRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-gray-500">
        {label}
      </dt>

      <dd className="max-w-[60%] break-words text-right text-sm font-medium text-gray-900">
        {value}
      </dd>
    </div>
  );
}

function StatusBadge({ value, fallback = "unknown" }) {
  const normalizedValue = String(value || fallback)
    .replaceAll("_", " ")
    .trim();

  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
      {normalizedValue}
    </span>
  );
}

function normalizeMetadata(metadata) {
  if (!metadata) {
    return {};
  }

  if (typeof metadata === "object") {
    return metadata;
  }

  if (typeof metadata === "string") {
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  }

  return {};
}

function formatDimensions(metadata) {
  if (!metadata.width || !metadata.height) {
    return "—";
  }

  return `${metadata.width} × ${metadata.height}`;
}

function formatFileSize(sizeInBytes) {
  const numericSize = Number(sizeInBytes);

  if (!Number.isFinite(numericSize) || numericSize <= 0) {
    return "—";
  }

  if (numericSize < 1024) {
    return `${numericSize} B`;
  }

  if (numericSize < 1024 * 1024) {
    return `${(numericSize / 1024).toFixed(1)} KB`;
  }

  return `${(numericSize / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
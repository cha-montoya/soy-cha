import Spinner from "../../../shared/components/Spinner";

export default function ImagePreview({
  content,
  generating = false,
  compact = false,
}) {
  if (!content) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Select a content item
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Choose an item from the gallery to inspect or generate
            its image.
          </p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div
        className={[
          "flex h-full items-center justify-center",
          compact
            ? "min-h-[360px] p-6"
            : "min-h-[520px] p-10",
        ].join(" ")}
      >
        <div className="text-center">
          <Spinner
            size={52}
            className="mx-auto text-gray-800"
          />

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            Generating image...
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            AI is creating the illustration.
            <br />
            This may take a few seconds.
          </p>
        </div>
      </div>
    );
  }

  if (!content.image_url) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center p-10">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <span className="text-3xl text-gray-300">
              ✦
            </span>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            No image generated yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Review the image prompt and use the inspector to
            generate the first version.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center bg-gray-50",
        compact
          ? "min-h-[360px] p-4"
          : "min-h-[520px] p-6",
      ].join(" ")}
    >
      <img
        src={content.image_url}
        alt={
          content.title
            ? `Generated illustration for ${content.title}`
            : "Generated illustration"
        }
        className={[
          "max-w-full rounded-xl border border-gray-200 bg-white object-contain shadow-sm",
          compact
            ? "max-h-[480px]"
            : "max-h-[calc(100vh-220px)]",
        ].join(" ")}
      />
    </div>
  );
}
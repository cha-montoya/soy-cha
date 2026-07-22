import {
  ImageIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

export default function PreviewImage({
  imageUrl = null,
  title = "",
  generating = false,
  compact = false,
}) {
  if (generating) {
    return (
      <div className={[
        "flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6",
        compact ? "min-h-52" : "min-h-72",
        ].join(" ")}
      >
        <div className="text-center">
          <SparkleIcon
            size={30}
            weight="duotone"
            className="mx-auto animate-pulse text-gray-400"
          />

          <p className="mt-3 text-sm font-semibold text-gray-700">
            Generating visual asset
          </p>

          <p className="mt-1 text-xs text-gray-500">
            The preview will update automatically.
          </p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6">
        <div className="max-w-xs text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white">
            <ImageIcon
              size={24}
              weight="duotone"
              className="text-gray-400"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-gray-700">
            Image not generated
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Generate the visual asset to complete this post preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <img
        src={imageUrl}
        alt={
          title
            ? `Visual asset for ${title}`
            : "Generated visual asset"
        }
        className={[
          "w-full object-contain",
          compact
            ? "max-h-[320px]"
            : "max-h-[620px]",
        ].join(" ")}
      />
    </div>
  );
}
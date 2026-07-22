import ImagePreview from "./ImagePreview";
import { LinkedInPostPreview } from "./preview";

export default function ImageWorkspace({
  content,
  generating = false,
}) {
  if (!content) {
    return (
      <div className="flex min-h-[520px] items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Select a content item
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Choose an item from the gallery to inspect its image and
            post preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="grid items-start gap-6 xl:grid-cols-2">
        {/* Visual Asset */}

        <section className="min-w-0">
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-900">
              Visual Asset
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Generated image in its original format.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <ImagePreview
              content={content}
              generating={generating}
              compact
            />
          </div>
        </section>

        {/* Post Preview */}

        <section className="min-w-0">
          <LinkedInPostPreview
            title={content.title}
            body={content.content}
            hashtags={content.hashtags}
            imageUrl={content.image_url}
            generating={generating}
            compact
          />
        </section>
      </div>
    </div>
  );
}
import ImageGalleryItem from "./ImageGalleryItem";

export default function ImageGallery({
  contents,
  selectedContent,
  onSelect,
}) {
  if (!contents.length) {
    return (
      <div className="flex min-h-64 items-center justify-center p-8">
        <div className="max-w-xs text-center">
          <h2 className="font-semibold text-gray-900">
            No content available
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Generate a content draft before creating an image.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {contents.map((content) => (
        <ImageGalleryItem
          key={content.id}
          content={content}
          selected={selectedContent?.id === content.id}
          onClick={() => onSelect(content)}
        />
      ))}
    </div>
  );
}
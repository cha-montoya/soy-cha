import { useEffect, useState } from "react";
import { generateImage } from "../../../services/image.service";
import Button from "../../../shared/components/Button";
import Spinner from "../../../shared/components/Spinner";
import SectionCard from "../../../shared/components/SectionCard";

export default function ContentDetail({ content }) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    setCurrentContent(content);
    setImageError("");
  }, [content]);

  async function handleGenerateImage() {
    if (!currentContent?.id || generatingImage) {
      return;
    }

    try {
      setGeneratingImage(true);
      setImageError("");

      const response = await generateImage(currentContent.id);

      if (response?.content) {
        setCurrentContent(response.content);
        return;
      }

      if (response?.image?.url) {
        setCurrentContent((previousContent) => ({
          ...previousContent,
          image_url: response.image.url,
          image_status:
            response.image.status ??
            previousContent?.image_status ??
            "generated",
          image_model:
            response.image.model ??
            previousContent?.image_model ??
            null,
          image_mime_type:
            response.image.mime_type ??
            previousContent?.image_mime_type ??
            null,
        }));
        return;
      }

      throw new Error(
        "The API response did not include the generated image URL."
      );
    } catch (error) {
      console.error("Unable to generate image:", error);

      setImageError(
        error?.message ||
          "Unable to generate the image. Please try again."
      );
    } finally {
      setGeneratingImage(false);
    }
  }

  if (!currentContent) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-gray-500">
        Selecciona un contenido.
      </div>
    );
  }

  const formattedDate = currentContent.created_at
    ? new Date(currentContent.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  const imageButtonLabel = generatingImage
    ? "Generating..."
    : currentContent.image_url
      ? "Regenerate Image"
      : "Generate Image";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <section className="space-y-3">
        <h1 className="font-display text-3xl font-black tracking-tight">
          {currentContent.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
            {currentContent.status}
          </span>

          {formattedDate && (
            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>
          )}
        </div>
      </section>

      {/* Image */}

      <SectionCard
        title="Image"
        action={
          <Button
            onClick={handleGenerateImage}
            disabled={generatingImage}
          >
            <div className="flex items-center gap-2">
              {generatingImage && <Spinner size={16} />}

              <span>{imageButtonLabel}</span>
            </div>
          </Button>
        }
      >
        <div className="max-w-[600px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {generatingImage ? (
            <div className="flex h-80 flex-col items-center justify-center px-6">
              <Spinner
                size={48}
                className="mb-5 text-gray-700"
              />

              <h3 className="text-lg font-semibold text-gray-900">
                Generating image...
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                AI is creating your illustration.
                <br />
                This may take a few seconds.
              </p>
            </div>
          ) : currentContent.image_url ? (
            <div className="bg-white">
              <img
                src={currentContent.image_url}
                alt={
                  currentContent.title
                    ? `Generated illustration for ${currentContent.title}`
                    : "Generated content illustration"
                }
                className="max-h-[720px] w-full object-contain"
              />
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center px-6">
              <p className="text-base font-medium text-gray-700">
                No image generated yet
              </p>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                Click <strong>Generate Image</strong> to create an
                illustration for this content.
              </p>
            </div>
          )}
        </div>

        {imageError && (
          <div
            role="alert"
            className="mt-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm font-medium text-red-700">
              {imageError}
            </p>

            <Button
              variant="secondary"
              onClick={handleGenerateImage}
              disabled={generatingImage}
            >
              Try Again
            </Button>
          </div>
        )}
      </SectionCard>

      {/* Copy */}

      <SectionCard
        title="Copy"
        action={
          <Button variant="secondary" disabled>
            Edit
          </Button>
        }
      >
        <div className="rounded-lg bg-gray-50 p-6">
          <p className="whitespace-pre-wrap leading-7">
            {currentContent.content || "No copy generated yet."}
          </p>
        </div>
      </SectionCard>

      {/* Hashtags */}

      <SectionCard
        title="Hashtags"
        action={
          <Button variant="secondary" disabled>
            Regenerate
          </Button>
        }
      >
        {currentContent.hashtags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentContent.hashtags.map((tag) => {
              const normalizedTag = String(tag).replace(/^#/, "");

              return (
                <span
                  key={normalizedTag}
                  className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  #{normalizedTag}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hashtags generated yet.
          </p>
        )}
      </SectionCard>

      {/* Image Prompt */}

      <SectionCard
        title="Image Prompt"
        action={
          <Button variant="secondary" disabled>
            Edit
          </Button>
        }
      >
        <div className="rounded-lg bg-gray-50 p-6">
          <p className="whitespace-pre-wrap text-sm leading-7">
            {currentContent.image_prompt ||
              "No image prompt generated yet."}
          </p>
        </div>
      </SectionCard>

      {/* Workflow */}

      <SectionCard title="Workflow">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current Status
            </p>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
              {currentContent.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="warning"
              disabled
            >
              Approve
            </Button>

            <Button
              variant="success"
              disabled
            >
              Publish
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
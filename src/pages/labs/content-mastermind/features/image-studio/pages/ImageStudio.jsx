import { useEffect, useMemo, useState } from "react";

import { routes } from "../../../config/routes";
import { generateImage } from "../../../services/image.service";

import useSelectedResource from "../../../shared/hooks/useSelectedResource";

import EmptyState from "../../../shared/components/EmptyState";
import SectionLoader from "../../../shared/components/SectionLoader";

import { useToast } from "../../../shared/context/ToastContext";

import useImageStudio from "../hooks/useImageStudio";

import ImageGallery from "../components/ImageGallery";
import ImageInspector from "../components/ImageInspector";
import ImageWorkspace from "../components/ImageWorkspace";

export default function ImageStudio() {
  const {
    contents,
    loading,
    error,
    updateContent,
    replaceContent,
  } = useImageStudio();

  const toast = useToast();

  const [generatingId, setGeneratingId] = useState(null);
  const [generationError, setGenerationError] = useState("");

  const sortedContents = useMemo(() => {
    return [...contents].sort((first, second) => {
      const firstDate =
        first.image_generated_at ||
        first.created_at ||
        0;

      const secondDate =
        second.image_generated_at ||
        second.created_at ||
        0;

      return (
        new Date(secondDate).getTime() -
        new Date(firstDate).getTime()
      );
    });
  }, [contents]);

  const {
    selectedResource: selectedContent,
    selectResource: selectContent,
    invalidSelection,
  } = useSelectedResource(
    sortedContents,
    routes.imageStudio,
    {
      loading,
      autoSelectFirst: true,
    }
  );

  useEffect(() => {
    setGenerationError("");
  }, [selectedContent?.id]);

  async function handleGenerateImage() {
    if (
      !selectedContent?.id ||
      generatingId
    ) {
      return;
    }

    try {
      setGeneratingId(selectedContent.id);
      setGenerationError("");

      updateContent(selectedContent.id, {
        image_status: "generating",
      });

      const response = await generateImage(
        selectedContent.id
      );

      if (response?.content?.id) {
        replaceContent(response.content);
      } else if (response?.image?.url) {
        updateContent(selectedContent.id, {
          image_url: response.image.url,
          image_status:
            response.image.status || "generated",
          image_model:
            response.image.model ||
            selectedContent.image_model ||
            null,
          image_mime_type:
            response.image.mime_type ||
            selectedContent.image_mime_type ||
            null,
          image_generated_at:
            response.image.generated_at ||
            new Date().toISOString(),
          image_metadata:
            response.image.metadata ||
            selectedContent.image_metadata ||
            {},
        });
      } else {
        throw new Error(
          "The API response did not include the generated image."
        );
      }

      toast.success({
        title: selectedContent.image_url
          ? "Image regenerated"
          : "Image generated",
        message:
          "The image is available in Image Studio.",
      });
    } catch (generateError) {
      console.error(
        "Unable to generate Image Studio image:",
        generateError
      );

      updateContent(selectedContent.id, {
        image_status:
          selectedContent.image_status || null,
      });

      const message =
        generateError?.message ||
        "Unable to generate the image. Please try again.";

      setGenerationError(message);

      toast.error({
        title: "Image generation failed",
        message,
        duration: 7000,
      });
    } finally {
      setGeneratingId(null);
    }
  }

  if (loading) {
    return (
      <SectionLoader text="Loading Image Studio..." />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load Image Studio"
        description={
          error?.message ||
          "An unexpected error occurred while loading the content."
        }
      />
    );
  }

  if (!contents.length) {
    return (
      <EmptyState
        title="Image Studio is empty"
        description="Generate a content draft before creating an image."
      />
    );
  }

  if (invalidSelection) {
    return (
      <EmptyState
        title="Image Studio item not found"
        description="The selected content does not exist or is no longer available."
      />
    );
  }

  const isGenerating =
    generatingId === selectedContent?.id;

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h1 className="font-display text-xl font-black tracking-tight text-gray-900">
            Image Studio
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {sortedContents.length} content item
            {sortedContents.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ImageGallery
            contents={sortedContents}
            selectedContent={selectedContent}
            onSelect={selectContent}
          />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto bg-gray-50">
        <ImageWorkspace
          content={selectedContent}
          generating={isGenerating}
        />
      </main>

      <aside className="w-80 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
        <ImageInspector
          content={selectedContent}
          generating={isGenerating}
          error={generationError}
          onGenerate={handleGenerateImage}
        />
      </aside>
    </div>
  );
}
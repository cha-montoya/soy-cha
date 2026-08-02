import { useEffect, useMemo, useState } from "react";

import { routes } from "../../../config/routes";
import { generateImage } from "../../../services/image.service";
import {
  approveContent,
  createPublication,
} from "../../publishing/services/publication.service";

import useSelectedResource from "../../../shared/hooks/useSelectedResource";

import EmptyState from "../../../shared/components/EmptyState";
import SectionLoader from "../../../shared/components/SectionLoader";
import { SearchInput, SelectInput } from "../../../shared/components/filters/FilterControls";
import { matchesSearch, uniqueOptions } from "../../../shared/utils/filters";

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
  const [approvingId, setApprovingId] = useState(null);
  const [sendingId, setSendingId] = useState(null);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [imageStatus, setImageStatus] = useState("all");

  const sourceOptions = useMemo(
    () => uniqueOptions(contents, (item) => item.source_name, "All sources"),
    [contents]
  );

  const sortedContents = useMemo(() => {
    return contents
      .filter((content) => {
        const normalizedImageStatus = content.image_status || (content.image_url ? "generated" : "not_generated");
        return (
          (source === "all" || content.source_name === source) &&
          (imageStatus === "all" || normalizedImageStatus === imageStatus) &&
          matchesSearch([content.title, content.topic, content.source_name], search)
        );
      })
      .sort((first, second) => {
        const firstDate = first.image_generated_at || first.created_at || 0;
        const secondDate = second.image_generated_at || second.created_at || 0;
        return new Date(secondDate).getTime() - new Date(firstDate).getTime();
      });
  }, [contents, imageStatus, search, source]);

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


  async function handleApproveContent() {
    if (!selectedContent?.id || approvingId) return;

    try {
      setApprovingId(selectedContent.id);
      const updated = await approveContent(selectedContent.id);
      replaceContent(updated);
      toast.success({
        title: "Content approved",
        message: "The copy is ready for the publication workflow.",
      });
    } catch (approveError) {
      toast.error({
        title: "Unable to approve content",
        message: approveError?.message || "The content could not be approved.",
      });
    } finally {
      setApprovingId(null);
    }
  }

  async function handleSendToPublishing() {
    if (!selectedContent?.id || sendingId) return;

    try {
      setSendingId(selectedContent.id);
      const response = await createPublication(selectedContent.id, "linkedin");
      toast.success({
        title: response.already_exists
          ? "Already in Publishing"
          : "Sent to Publishing",
        message: response.already_exists
          ? "An active LinkedIn queue record already exists for this content."
          : "The LinkedIn publication is ready to be scheduled.",
      });
    } catch (sendError) {
      toast.error({
        title: "Unable to send to Publishing",
        message: sendError?.message || "The publication queue record could not be created.",
      });
    } finally {
      setSendingId(null);
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
    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white lg:h-full">
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            Image Studio
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {sortedContents.length} of {contents.length} content item
            {contents.length !== 1 ? "s" : ""}
          </p>

          <div className="mt-4 space-y-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search content..." />
            <SelectInput label="Source" value={source} onChange={setSource} options={sourceOptions} />
            <SelectInput
              label="Image status"
              value={imageStatus}
              onChange={setImageStatus}
              options={[
                { value: "all", label: "All image statuses" },
                { value: "not_generated", label: "Not generated" },
                { value: "generating", label: "Generating" },
                { value: "generated", label: "Generated" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {sortedContents.length ? (
            <ImageGallery
              contents={sortedContents}
              selectedContent={selectedContent}
              onSelect={selectContent}
            />
          ) : (
            <EmptyState title="No matching content" description="Change the search or filters." />
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto bg-gray-50">
        <ImageWorkspace
          content={selectedContent}
          generating={isGenerating}
          approving={approvingId === selectedContent?.id}
          sending={sendingId === selectedContent?.id}
          onApprove={handleApproveContent}
          onSendToPublishing={handleSendToPublishing}
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
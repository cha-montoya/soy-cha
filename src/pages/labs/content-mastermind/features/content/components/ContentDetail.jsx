import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

import { routes } from "../../../config/routes";

import Button from "../../../shared/components/Button";
import SectionCard from "../../../shared/components/SectionCard";
import Badge from "../../../shared/components/Badge";
import StatusBadge from "../../../shared/components/StatusBadge";
import { useToast } from "../../../shared/context/ToastContext";
import { approveContent } from "../../publishing/services/publication.service";

export default function ContentDetail({ content, onContentUpdated }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [approving, setApproving] = useState(false);

  const formattedDate = useMemo(() => {
    if (!content?.created_at) {
      return null;
    }

    const date = new Date(content.created_at);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, [content?.created_at]);

  function handleOpenImageStudio() {
    if (!content?.id) {
      return;
    }

    navigate(
      `${routes.imageStudio}/${encodeURIComponent(
        String(content.id)
      )}`
    );
  }

  async function handleApprove() {
    if (!content?.id || approving) return;

    try {
      setApproving(true);
      const updated = await approveContent(content.id);
      onContentUpdated?.(updated);
      toast.success({
        title: "Content approved",
        message: "Review the final mockup in Image Studio before sending it to Publishing.",
      });
    } catch (approveError) {
      toast.error({
        title: "Unable to approve content",
        message: approveError?.message || "The content could not be approved.",
      });
    } finally {
      setApproving(false);
    }
  }

  if (!content) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-gray-500">
        Selecciona un contenido.
      </div>
    );
  }

  const hasImage = Boolean(content.image_url);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {content.title || "Untitled content"}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge value={content.status} />

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
          <Button onClick={handleOpenImageStudio}>
            <span className="flex items-center gap-2">
              <ArrowSquareOutIcon
                size={18}
                weight="bold"
              />

              <span>Open in Image Studio</span>
            </span>
          </Button>
        }
      >
        <div className="max-w-[600px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {hasImage ? (
            <div className="bg-white">
              <img
                src={content.image_url}
                alt={
                  content.title
                    ? `Generated illustration for ${content.title}`
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

              <p className="mt-2 max-w-md text-center text-sm leading-6 text-gray-500">
                Open this content in Image Studio to review the
                prompt and generate its first image.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge
            value={content.image_status}
            fallback={hasImage ? "generated" : "not_generated"}
          />

          {content.image_model && (
            <Badge>{content.image_model}</Badge>
          )}
        </div>
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
            {content.content || "No copy generated yet."}
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
        {content.hashtags?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => {
              const normalizedTag = String(tag).replace(/^#/, "");

              return (
                <span
                  key={`${normalizedTag}-${index}`}
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
          <Button
            variant="secondary"
            onClick={handleOpenImageStudio}
          >
            Open in Image Studio
          </Button>
        }
      >
        <div className="rounded-lg bg-gray-50 p-6">
          <p className="whitespace-pre-wrap text-sm leading-7">
            {content.image_prompt ||
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

            <StatusBadge value={content.status} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="warning"
              disabled={content.status === "approved"}
              loading={approving}
              loadingText="Approving..."
              onClick={handleApprove}
            >
              {content.status === "approved" ? "Approved" : "Approve copy"}
            </Button>

            <Button
              variant="success"
              onClick={handleOpenImageStudio}
            >
              Review & publish
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

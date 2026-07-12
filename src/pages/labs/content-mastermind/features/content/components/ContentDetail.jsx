import { useState } from "react";
import { generateImage } from "../../../services/image.service";
import Button from "../../../shared/components/Button";
import Spinner from "../../../shared/components/Spinner";
import SectionCard from "../../../shared/components/SectionCard";

export default function ContentDetail({ content }) {
  if (!content) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-gray-500">
        Selecciona un contenido.
      </div>
    );
  }

  const [generatingImage, setGeneratingImage] = useState(false);

  async function handleGenerateImage() {
    try {
      setGeneratingImage(true);

      await generateImage(content.id);
    } finally {
      setGeneratingImage(false);
    }
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <section className="space-y-3">

        <h1 className="font-display text-3xl font-black tracking-tight">
          {content.title}
        </h1>

        <div className="flex items-center gap-3">

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
            {content.status}
          </span>

          <span className="text-sm text-gray-500">
            {new Date(content.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>

        </div>

      </section>

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
            {content.content}
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
        <div className="flex flex-wrap gap-2">

          {content.hashtags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
            >
              #{tag}
            </span>
          ))}

        </div>
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
            {content.image_prompt}
          </p>

        </div>
      </SectionCard>

      {/* Image */}

      <SectionCard
        title="Image"
        action={
          <Button
            onClick={handleGenerateImage}
            disabled={generatingImage}
          >

            <div className="flex items-center gap-2">

              {generatingImage && (
                <Spinner size={16} />
              )}

              <span>
                {generatingImage
                  ? "Generating..."
                  : "Generate Image"}
              </span>

            </div>

          </Button>
        }
      >

        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-300">

          {generatingImage ? (
            <>
              <Spinner
                size={48}
                className="mb-5 text-gray-700"
              />

              <h3 className="text-lg font-semibold">
                Generating image...
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                AI is creating your illustration.
                <br />
                This usually takes a few seconds.
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-medium text-gray-700">
                No image generated yet
              </p>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                Click the <strong>Generate Image</strong> button
                <br />
                to create an illustration for this content.
              </p>
            </>
          )}

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
              {content.status}
            </span>

          </div>

          <div className="flex gap-3">

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
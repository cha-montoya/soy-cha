import Button from "../../../shared/components/Button";

export default function PublishingActions({
  content,
  approving = false,
  sending = false,
  onApprove,
  onSend,
}) {
  if (!content) return null;

  const approved =
    content.status === "approved" ||
    content.review_status === "approved";
  const imageReady =
    content.image_status === "generated" && Boolean(content.image_url);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            Publication readiness
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Approve the editorial content, then send the final LinkedIn creative to the publication queue.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
          <span className={`rounded-full px-3 py-1 ${approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            Copy {approved ? "approved" : "pending"}
          </span>
          <span className={`rounded-full px-3 py-1 ${imageReady ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
            Image {imageReady ? "ready" : "pending"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant="warning"
          disabled={approved}
          loading={approving}
          loadingText="Approving..."
          onClick={onApprove}
        >
          {approved ? "Content approved" : "Approve content"}
        </Button>

        <Button
          variant="success"
          disabled={!approved || !imageReady}
          loading={sending}
          loadingText="Sending..."
          onClick={onSend}
        >
          Send to Publishing
        </Button>
      </div>

      {!imageReady && (
        <p className="mt-3 text-sm text-gray-500">
          Generate the final image before sending this content to Publishing.
        </p>
      )}
    </section>
  );
}

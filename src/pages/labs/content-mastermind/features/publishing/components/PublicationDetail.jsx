import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../../../config/routes";
import Button from "../../../shared/components/Button";
import SectionCard from "../../../shared/components/SectionCard";
import Badge from "../../../shared/components/Badge";
import StatusBadge from "../../../shared/components/StatusBadge";

function toLocalInputValue(value) {
  const date = value ? new Date(value) : new Date(Date.now() + 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 16);
}

export default function PublicationDetail({
  publication,
  busyAction,
  onSchedule,
  onCancel,
  onPublish,
  linkedInStatus,
  onConnectLinkedIn,
}) {
  const [scheduledAt, setScheduledAt] = useState(() =>
    toLocalInputValue(publication?.scheduled_at)
  );
  const content = publication?.generated_content || {};

  const hashtags = useMemo(
    () => (Array.isArray(content.hashtags) ? content.hashtags : []),
    [content.hashtags]
  );

  if (!publication) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-gray-500">
        Select a publication.
      </div>
    );
  }

  const canSchedule = ["approved", "failed", "scheduled"].includes(publication.status);
  const canCancel = !["published", "cancelled", "publishing"].includes(publication.status);
  const canPreparePublishNow = ["approved", "failed", "scheduled"].includes(publication.status);

  return (
    <div className="space-y-6 p-6">
      <section>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="info">{publication.platform}</Badge>
          <StatusBadge value={publication.status} />
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {content.title || "Untitled publication"}
        </h1>

        {content.id && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
            <Link className="underline underline-offset-4" to={`${routes.content}/${content.id}`}>
              Open in Content
            </Link>
            <Link className="underline underline-offset-4" to={`${routes.imageStudio}/${content.id}`}>
              Open in Image Studio
            </Link>
          </div>
        )}

        {publication.external_post_id && (
          <a
            className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
            href={publication.metadata?.linkedin?.external_url || `https://www.linkedin.com/feed/update/${publication.external_post_id}/`}
            target="_blank"
            rel="noreferrer"
          >
            View published post
          </a>
        )}
      </section>

      <SectionCard title="LinkedIn preview">
        <div className="mx-auto max-w-[620px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <p className="whitespace-pre-wrap leading-7 text-gray-800">
              {content.content || "No post copy available."}
            </p>
            {hashtags.length > 0 && (
              <p className="mt-4 text-blue-700">
                {hashtags.map((tag) => `#${String(tag).replace(/^#/, "")}`).join(" ")}
              </p>
            )}
          </div>
          {content.image_url && (
            <img
              src={content.image_url}
              alt={content.title || "Publication image"}
              className="max-h-[620px] w-full object-contain"
            />
          )}
        </div>
      </SectionCard>

      <SectionCard title="Publication actions">
        <div className="flex flex-wrap gap-3">
          {linkedInStatus?.connected ? (
            <Button
              disabled={!canPreparePublishNow}
              loading={busyAction === "publish"}
              loadingText="Publishing..."
              onClick={onPublish}
            >
              Publish now
            </Button>
          ) : (
            <Button
              variant="secondary"
              loading={busyAction === "connect"}
              loadingText="Connecting..."
              onClick={onConnectLinkedIn}
            >
              Connect LinkedIn
            </Button>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-500">
          {linkedInStatus?.connected
            ? `Connected${linkedInStatus.display_name ? ` as ${linkedInStatus.display_name}` : ""}. The post will be published immediately.`
            : linkedInStatus?.expired
              ? "The LinkedIn connection expired. Reconnect the account before publishing."
              : "Connect the LinkedIn account that will publish this content."}
        </p>
      </SectionCard>

      <SectionCard title="Schedule">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Publication date and time
            </span>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              disabled={!canSchedule || Boolean(busyAction)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
          </label>

          <Button
            variant="success"
            disabled={!canSchedule || !scheduledAt}
            loading={busyAction === "schedule"}
            loadingText="Scheduling..."
            onClick={() => onSchedule(new Date(scheduledAt).toISOString())}
          >
            {publication.status === "scheduled" ? "Reschedule" : "Schedule"}
          </Button>
        </div>
      </SectionCard>

      {canCancel && (
        <SectionCard title="Publication controls">
          <Button
            variant="danger"
            loading={busyAction === "cancel"}
            loadingText="Cancelling..."
            onClick={() => onCancel("Cancelled from Publishing")}
          >
            Cancel publication
          </Button>
        </SectionCard>
      )}

      {publication.error_message && (
        <SectionCard title="Last error">
          <p className="text-sm leading-6 text-red-700">
            {publication.error_message}
          </p>
        </SectionCard>
      )}
    </div>
  );
}

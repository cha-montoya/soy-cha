import {
  LinkedinLogoIcon,
  SealCheckIcon,
} from "@phosphor-icons/react";

import PreviewAvatar from "./PreviewAvatar";
import Badge from "../../../../shared/components/Badge";

export default function PreviewHeader({
  authorName = "Content Mastermind",
  authorRole = "AI Content Workspace",
  authorImage = null,
  channel = "LinkedIn",
}) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <PreviewAvatar
          name={authorName}
          imageUrl={authorImage}
        />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-gray-900">
              {authorName}
            </p>

            <SealCheckIcon
              size={16}
              weight="fill"
              className="shrink-0 text-gray-400"
            />
          </div>

          <p className="mt-0.5 truncate text-xs text-gray-500">
            {authorRole}
          </p>

          <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Just now
          </p>
        </div>
      </div>

      <Badge
        variant="info"
        size="md"
        icon={<LinkedinLogoIcon size={15} weight="fill" />}
      >
        {channel}
      </Badge>
    </header>
  );
}
import Badge from "./Badge";

const STATUS_VARIANTS = {
  approved: "success",
  generated: "success",
  image_ready: "success",
  ready: "success",
  published: "success",

  draft: "warning",
  pending: "warning",
  pending_approval: "warning",
  pending_review: "warning",
  scheduled: "warning",

  publishing: "info",
  processing: "info",

  failed: "danger",
  error: "danger",
  cancelled: "neutral",
  not_generated: "neutral",
  unknown: "neutral",
};

export function formatBadgeLabel(value, fallback = "unknown") {
  return String(value || fallback)
    .replaceAll("_", " ")
    .trim();
}

export default function StatusBadge({
  status,
  value,
  fallback = "unknown",
  variant,
  size = "sm",
  className = "",
}) {
  const normalized = String(status || value || fallback).toLowerCase();

  return (
    <Badge
      variant={variant || STATUS_VARIANTS[normalized] || "neutral"}
      size={size}
      className={className}
    >
      {formatBadgeLabel(normalized, fallback)}
    </Badge>
  );
}

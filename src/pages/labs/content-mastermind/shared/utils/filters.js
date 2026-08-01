export function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function matchesSearch(values, query) {
  const normalized = normalizeText(query);
  if (!normalized) return true;

  return values
    .filter((value) => value !== null && value !== undefined)
    .map(normalizeText)
    .some((value) => value.includes(normalized));
}

export function isWithinDateRange(value, from, to) {
  if (!from && !to) return true;
  if (!value) return false;

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;

  if (from) {
    const fromTime = new Date(`${from}T00:00:00`).getTime();
    if (timestamp < fromTime) return false;
  }

  if (to) {
    const toTime = new Date(`${to}T23:59:59.999`).getTime();
    if (timestamp > toTime) return false;
  }

  return true;
}

export function uniqueOptions(items, getter, allLabel) {
  const values = [...new Set(items.map(getter).filter(Boolean))]
    .map(String)
    .sort((a, b) => a.localeCompare(b));

  return [
    { value: "all", label: allLabel },
    ...values.map((value) => ({ value, label: value })),
  ];
}

export function formatDate(value, locale = "es-MX") {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

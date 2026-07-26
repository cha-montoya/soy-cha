import api from "../../../services/api";

export async function approveContent(contentId) {
  const response = await api.post(
    `/content/${encodeURIComponent(contentId)}/approve`,
    {}
  );

  return response.content;
}

export async function createPublication(contentId, platform = "linkedin") {
  return api.post("/publications", {
    generated_content_id: contentId,
    platform,
  });
}

export async function getPublications(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.platform && filters.platform !== "all") {
    params.set("platform", filters.platform);
  }

  const query = params.toString();
  const response = await api.get(`/publications${query ? `?${query}` : ""}`);

  return Array.isArray(response.publications)
    ? response.publications
    : [];
}

export async function schedulePublication(publicationId, scheduledAt) {
  const response = await api.post(
    `/publications/${encodeURIComponent(publicationId)}/schedule`,
    { scheduled_at: scheduledAt }
  );

  return response.publication;
}

export async function cancelPublication(publicationId, reason = "") {
  const response = await api.post(
    `/publications/${encodeURIComponent(publicationId)}/cancel`,
    { reason }
  );

  return response.publication;
}

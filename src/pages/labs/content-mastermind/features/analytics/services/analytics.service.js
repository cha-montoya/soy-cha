import api from "../../../services/api";

function withQuery(endpoint, filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "" && value !== "all") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

export async function getLinkedInOverview(filters = {}) {
  const response = await api.get(withQuery("/analytics/linkedin/overview", filters));
  return response;
}

export async function getLinkedInPosts(filters = {}) {
  const response = await api.get(withQuery("/analytics/linkedin/posts", filters));
  return Array.isArray(response.posts) ? response.posts : [];
}

export async function getLinkedInDaily(filters = {}) {
  const response = await api.get(withQuery("/analytics/linkedin/daily", filters));
  return Array.isArray(response.daily) ? response.daily : [];
}

export async function getLinkedInTopics(filters = {}) {
  const response = await api.get(withQuery("/analytics/linkedin/topics", filters));
  return Array.isArray(response.topics) ? response.topics : [];
}

export async function getLinkedInSources(filters = {}) {
  const response = await api.get(withQuery("/analytics/linkedin/sources", filters));
  return Array.isArray(response.sources) ? response.sources : [];
}

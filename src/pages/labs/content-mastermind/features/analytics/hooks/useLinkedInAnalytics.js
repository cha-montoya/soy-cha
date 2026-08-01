import { useCallback, useEffect, useState } from "react";
import {
  getLinkedInDaily,
  getLinkedInOverview,
  getLinkedInPosts,
  getLinkedInSources,
  getLinkedInTopics,
} from "../services/analytics.service";

export default function useLinkedInAnalytics(filters = {}) {
  const [data, setData] = useState({
    overview: null,
    topPosts: [],
    posts: [],
    daily: [],
    topics: [],
    sources: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewResponse, posts, daily, topics, sources] = await Promise.all([
        getLinkedInOverview(filters),
        getLinkedInPosts(filters),
        getLinkedInDaily(filters),
        getLinkedInTopics(filters),
        getLinkedInSources(filters),
      ]);

      setData({
        overview: overviewResponse.overview || null,
        topPosts: Array.isArray(overviewResponse.top_posts) ? overviewResponse.top_posts : [],
        posts,
        daily,
        topics,
        sources,
      });
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }, [filters.from, filters.to]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, reload: load };
}

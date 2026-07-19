import { useCallback, useEffect, useState } from "react";
import { getOverviewData } from "../services/overview.service";

const INITIAL_DATA = {
  brandIdentity: {
    companyName: "",
    companyLogo: "",
  },
  metrics: {
    articles: 0,
    analysis: 0,
    content: 0,
    images: 0,
    published: 0,
  },
  pipeline: [],
  publicationQueue: {
    pending: 0,
    scheduled: 0,
    published: 0,
    failed: 0,
  },
  recentContent: [],
};

export default function useOverview() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const overviewData = await getOverviewData();
      setData(overviewData);
    } catch (requestError) {
      console.error("Unable to load overview:", requestError);

      setError(
        requestError?.message ||
          "Unable to load the overview dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  return {
    ...data,
    loading,
    refreshing,
    error,
    refresh: () => loadOverview(true),
  };
}
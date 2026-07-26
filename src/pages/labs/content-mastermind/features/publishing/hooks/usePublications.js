import { useCallback, useEffect, useState } from "react";
import { getPublications } from "../services/publication.service";

export default function usePublications(filters = {}) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setPublications(await getPublications(filters));
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }, [filters.platform, filters.status]);

  useEffect(() => {
    load();
  }, [load]);

  const replacePublication = useCallback((updated) => {
    if (!updated?.id) return;

    setPublications((current) =>
      current.map((item) =>
        String(item.id) === String(updated.id)
          ? { ...item, ...updated }
          : item
      )
    );
  }, []);

  return {
    publications,
    loading,
    error,
    reload: load,
    replacePublication,
  };
}

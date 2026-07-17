import { useCallback, useEffect, useState } from "react";
import articleService from "../services/article.service";

export default function useAnalysis() {
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await articleService.getAnalysis();

      setAnalysis(data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    analysis,
    loading,
    error,
    reload: load,
  };
}
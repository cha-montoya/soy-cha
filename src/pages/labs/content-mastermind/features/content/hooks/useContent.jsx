import { useCallback, useEffect, useState } from "react";
import { getContents } from "../services/content.service";

export default function useContent() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getContents();
        setContents(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const replaceContent = useCallback((updatedContent) => {
    if (!updatedContent?.id) return;

    setContents((current) =>
      current.map((item) =>
        String(item.id) === String(updatedContent.id)
          ? updatedContent
          : item
      )
    );
  }, []);

  return {
    contents,
    loading,
    error,
    replaceContent,
  };
}
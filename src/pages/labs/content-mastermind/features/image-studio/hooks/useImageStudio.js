import { useCallback, useEffect, useState } from "react";

import { getImageStudioContents } from "../services/image-studio.service";

export default function useImageStudio() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getImageStudioContents();

      setContents(data);
    } catch (loadError) {
      console.error(
        "Unable to load Image Studio contents:",
        loadError
      );

      setError(loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const updateContent = useCallback((contentId, changes) => {
    if (!contentId) {
      return;
    }

    setContents((currentContents) =>
      currentContents.map((content) => {
        if (String(content.id) !== String(contentId)) {
          return content;
        }

        return {
          ...content,
          ...changes,
        };
      })
    );
  }, []);

  const replaceContent = useCallback((updatedContent) => {
    if (!updatedContent?.id) {
      return;
    }

    setContents((currentContents) =>
      currentContents.map((content) =>
        String(content.id) === String(updatedContent.id)
          ? updatedContent
          : content
      )
    );
  }, []);

  return {
    contents,
    loading,
    error,
    reload: loadContents,
    updateContent,
    replaceContent,
  };
}
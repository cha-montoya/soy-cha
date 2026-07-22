import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function useUrlSelection(basePath) {
  const navigate = useNavigate();
  const { id } = useParams();

  const selectId = useCallback(
    (resourceId, options = {}) => {
      const { replace = false } = options;

      if (
        resourceId === undefined ||
        resourceId === null ||
        resourceId === ""
      ) {
        navigate(basePath, { replace });
        return;
      }

      navigate(`${basePath}/${encodeURIComponent(String(resourceId))}`, {
        replace,
      });
    },
    [basePath, navigate]
  );

  const clearSelection = useCallback(
    (options = {}) => {
      const { replace = false } = options;

      navigate(basePath, { replace });
    },
    [basePath, navigate]
  );

  return {
    selectedId: id || null,
    selectId,
    clearSelection,
  };
}
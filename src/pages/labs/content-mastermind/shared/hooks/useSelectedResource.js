import { useCallback, useEffect, useMemo } from "react";

import useUrlSelection from "./useUrlSelection";

export default function useSelectedResource(
  resources,
  basePath,
  options = {}
) {
  const {
    loading = false,
    autoSelectFirst = true,
  } = options;

  const normalizedResources = useMemo(
    () => (Array.isArray(resources) ? resources : []),
    [resources]
  );

  const {
    selectedId,
    selectId,
    clearSelection,
  } = useUrlSelection(basePath);

  const selectedResource = useMemo(() => {
    if (!selectedId) {
      return null;
    }

    return (
      normalizedResources.find(
        (resource) =>
          String(resource.id) === String(selectedId)
      ) || null
    );
  }, [normalizedResources, selectedId]);

  const invalidSelection =
    !loading &&
    Boolean(selectedId) &&
    !selectedResource;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!autoSelectFirst) {
      return;
    }

    if (selectedId) {
      return;
    }

    if (normalizedResources.length === 0) {
      return;
    }

    selectId(normalizedResources[0].id, {
      replace: true,
    });
  }, [
    autoSelectFirst,
    loading,
    normalizedResources,
    selectedId,
    selectId,
  ]);

  const selectResource = useCallback(
    (resource, navigationOptions = {}) => {
      if (
        resource?.id === undefined ||
        resource?.id === null ||
        resource?.id === ""
      ) {
        return;
      }

      selectId(resource.id, navigationOptions);
    },
    [selectId]
  );

  return {
    selectedId,
    selectedResource,
    selectResource,
    clearSelection,
    invalidSelection,
  };
}
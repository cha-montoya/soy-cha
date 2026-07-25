import { useCallback, useEffect, useState } from "react";

import {
  getWorkspaceSettings,
  saveWorkspaceSettings,
} from "../services/settings.service";

const EMPTY_WORKSPACE = {
  id: null,
  workspaceName: "",
  companyName: "",
  website: "",
  industry: "",
  language: "es",
  timezone: "America/Mexico_City",
};

function mapWorkspaceFromDatabase(data) {
  if (!data) {
    return EMPTY_WORKSPACE;
  }

  return {
    id: data.id,
    workspaceName: data.workspace_name || "",
    companyName: data.company_name || "",
    website: data.website || "",
    industry: data.industry || "",
    language: data.language || "es",
    timezone: data.timezone || "America/Mexico_City",
  };
}

export function useWorkspaceSettings() {
  const [workspace, setWorkspace] = useState(EMPTY_WORKSPACE);
  const [savedWorkspace, setSavedWorkspace] =
    useState(EMPTY_WORKSPACE);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadWorkspace = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWorkspaceSettings();
      const mappedWorkspace = mapWorkspaceFromDatabase(data);

      setWorkspace(mappedWorkspace);
      setSavedWorkspace(mappedWorkspace);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  function updateField(name, value) {
    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      [name]: value,
    }));
  }

  function cancelChanges() {
    setWorkspace(savedWorkspace);
    setError(null);
  }

  async function saveChanges() {
    if (!workspace.id) {
      setError("Workspace settings could not be identified.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = await saveWorkspaceSettings(workspace);
      const mappedWorkspace = mapWorkspaceFromDatabase(data);

      setWorkspace(mappedWorkspace);
      setSavedWorkspace(mappedWorkspace);

      return mappedWorkspace;
    } catch (saveError) {
      setError(saveError.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  const isDirty =
    JSON.stringify(workspace) !== JSON.stringify(savedWorkspace);

  return {
    workspace,
    isLoading,
    isSaving,
    isDirty,
    error,
    updateField,
    saveChanges,
    cancelChanges,
    reload: loadWorkspace,
  };
}
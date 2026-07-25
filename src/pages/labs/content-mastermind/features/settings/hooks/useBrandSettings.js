import { useCallback, useEffect, useState } from "react";

import {
  getBrandSettings,
  saveBrandSettings,
} from "../services/settings.service";

const EMPTY_BRAND = {
  id: null,
  workspaceId: null,
  brandName: "",
  primaryColor: "#111827",
  secondaryColor: "#64748b",
  accentColor: "#2563eb",
  visualDirection: "",
  logoPath: null,
};

function mapBrandFromDatabase(data) {
  if (!data) {
    return EMPTY_BRAND;
  }

  return {
    id: data.id,
    workspaceId: data.workspace_settings_id,
    brandName: data.brand_name || "",
    primaryColor: data.primary_color || "#111827",
    secondaryColor: data.secondary_color || "#64748b",
    accentColor: data.accent_color || "#2563eb",
    visualDirection: data.visual_direction || "",
    logoPath: data.logo_path || null,
  };
}

export function useBrandSettings(workspaceId) {
  const [brand, setBrand] = useState(EMPTY_BRAND);
  const [savedBrand, setSavedBrand] = useState(EMPTY_BRAND);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadBrand = useCallback(async () => {
    if (!workspaceId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getBrandSettings(workspaceId);
      const mappedBrand = mapBrandFromDatabase(data);

      setBrand(mappedBrand);
      setSavedBrand(mappedBrand);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadBrand();
  }, [loadBrand]);

  function updateField(name, value) {
    setBrand((currentBrand) => ({
      ...currentBrand,
      [name]: value,
    }));
  }

  function cancelChanges() {
    setBrand(savedBrand);
    setError(null);
  }

  async function saveChanges() {
    if (!brand.id) {
      setError("Brand settings could not be identified.");
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = await saveBrandSettings(brand);
      const mappedBrand = mapBrandFromDatabase(data);

      setBrand(mappedBrand);
      setSavedBrand(mappedBrand);

      return mappedBrand;
    } catch (saveError) {
      setError(saveError.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  const isDirty =
    JSON.stringify(brand) !== JSON.stringify(savedBrand);

  return {
    brand,
    isLoading,
    isSaving,
    isDirty,
    error,
    updateField,
    saveChanges,
    cancelChanges,
    reload: loadBrand,
  };
}
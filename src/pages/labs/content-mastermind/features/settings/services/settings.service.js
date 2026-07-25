import { supabase } from "../../../lib/supabase";

const WORKSPACE_TABLE = "workspace_settings";
const BRAND_TABLE = "brand_settings";

const BRAND_REFERENCE_TABLE = "brand_reference_assets";
const BRAND_ASSETS_BUCKET = "brand-assets";
const SIGNED_URL_DURATION = 60 * 60;

export async function getWorkspaceSettings() {
  const { data, error } = await supabase
    .from(WORKSPACE_TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load workspace settings: ${error.message}`,
    );
  }

  return data;
}

export async function saveWorkspaceSettings(settings) {
  if (!settings?.id) {
    throw new Error("Workspace settings ID is required.");
  }

  const payload = {
    workspace_name: settings.workspaceName?.trim() || "",
    company_name: settings.companyName?.trim() || "",
    website: settings.website?.trim() || "",
    industry: settings.industry?.trim() || "",
    language: settings.language || "es",
    timezone: settings.timezone || "America/Mexico_City",
  };

  const { data, error } = await supabase
    .from(WORKSPACE_TABLE)
    .update(payload)
    .eq("id", settings.id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Unable to save workspace settings: ${error.message}`,
    );
  }

  return data;
}

export async function getBrandSettings(workspaceId) {
  if (!workspaceId) {
    throw new Error("Workspace ID is required.");
  }

  const { data, error } = await supabase
    .from(BRAND_TABLE)
    .select("*")
    .eq("workspace_settings_id", workspaceId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to load brand settings: ${error.message}`,
    );
  }

  return data;
}

export async function saveBrandSettings(settings) {
  if (!settings?.id) {
    throw new Error("Brand settings ID is required.");
  }

  const payload = {
    brand_name: settings.brandName?.trim() || "",
    primary_color: settings.primaryColor || null,
    secondary_color: settings.secondaryColor || null,
    accent_color: settings.accentColor || null,
    visual_direction:
      settings.visualDirection?.trim() || null,
  };

  const { data, error } = await supabase
    .from(BRAND_TABLE)
    .update(payload)
    .eq("id", settings.id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Unable to save brand settings: ${error.message}`,
    );
  }

  return data;
}

function sanitizeFileName(fileName = "") {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

function createStoragePath({
  workspaceId,
  assetType,
  fileName,
}) {
  const safeFileName =
    sanitizeFileName(fileName) || "brand-asset";

  const uniqueName = `${crypto.randomUUID()}-${safeFileName}`;

  return `${workspaceId}/${assetType}/${uniqueName}`;
}

export async function createBrandAssetSignedUrl(storagePath) {
  if (!storagePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_DURATION);

  if (error) {
    throw new Error(
      `Unable to create asset preview URL: ${error.message}`,
    );
  }

  return data?.signedUrl || null;
}

export async function uploadBrandAsset({
  workspaceId,
  assetType,
  file,
}) {
  if (!workspaceId) {
    throw new Error("Workspace ID is required.");
  }

  if (!assetType) {
    throw new Error("Asset type is required.");
  }

  if (!file) {
    throw new Error("A file is required.");
  }

  const storagePath = createStoragePath({
    workspaceId,
    assetType,
    fileName: file.name,
  });

  const { data, error } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Unable to upload brand asset: ${error.message}`,
    );
  }

  return {
    storagePath: data.path,
    fileName: file.name,
    mimeType: file.type || null,
    fileSize: file.size || null,
  };
}

export async function removeBrandAsset(storagePath) {
  if (!storagePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(
      `Unable to remove brand asset: ${error.message}`,
    );
  }
}

export async function updateBrandLogo({
  brandSettingsId,
  logoPath,
}) {
  if (!brandSettingsId) {
    throw new Error("Brand settings ID is required.");
  }

  const { data, error } = await supabase
    .from(BRAND_TABLE)
    .update({
      logo_path: logoPath || null,
    })
    .eq("id", brandSettingsId)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Unable to update brand logo: ${error.message}`,
    );
  }

  return data;
}

export async function getBrandReferenceAssets(
  brandSettingsId,
) {
  if (!brandSettingsId) {
    throw new Error("Brand settings ID is required.");
  }

  const { data, error } = await supabase
    .from(BRAND_REFERENCE_TABLE)
    .select("*")
    .eq("brand_settings_id", brandSettingsId)
    .eq("asset_type", "reference_image")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(
      `Unable to load reference assets: ${error.message}`,
    );
  }

  return data || [];
}

export async function createBrandReferenceAsset({
  brandSettingsId,
  storagePath,
  fileName,
  mimeType,
  fileSize,
}) {
  if (!brandSettingsId) {
    throw new Error("Brand settings ID is required.");
  }

  const payload = {
    brand_settings_id: brandSettingsId,
    asset_type: "reference_image",
    storage_path: storagePath,
    file_name: fileName,
    mime_type: mimeType,
    file_size: fileSize,
  };

  const { data, error } = await supabase
    .from(BRAND_REFERENCE_TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Unable to save reference asset: ${error.message}`,
    );
  }

  return data;
}

export async function deleteBrandReferenceAsset(assetId) {
  if (!assetId) {
    throw new Error("Reference asset ID is required.");
  }

  const { error } = await supabase
    .from(BRAND_REFERENCE_TABLE)
    .delete()
    .eq("id", assetId);

  if (error) {
    throw new Error(
      `Unable to delete reference asset: ${error.message}`,
    );
  }
}
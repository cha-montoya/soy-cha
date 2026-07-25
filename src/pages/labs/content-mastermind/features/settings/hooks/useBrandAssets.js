import { useCallback, useEffect, useState } from "react";

import {
  createBrandAssetSignedUrl,
  createBrandReferenceAsset,
  deleteBrandReferenceAsset,
  getBrandReferenceAssets,
  removeBrandAsset,
  updateBrandLogo,
  uploadBrandAsset,
} from "../services/settings.service";

const EMPTY_ASSETS = {
  logo: [],
  referenceImages: [],
};

async function mapStoredAsset(asset) {
  const preview = await createBrandAssetSignedUrl(
    asset.storage_path,
  );

  return {
    id: asset.id,
    name: asset.file_name || "Brand asset",
    size: asset.file_size || null,
    type: asset.mime_type || null,
    storagePath: asset.storage_path,
    preview,
    persisted: true,
    file: null,
  };
}

async function loadStoredAssets({
  brandSettingsId,
  logoPath,
}) {
  let logo = [];

  if (logoPath) {
    const logoPreview =
      await createBrandAssetSignedUrl(logoPath);

    logo = [
      {
        id: "brand-logo",
        name:
          logoPath.split("/").pop() ||
          "Brand logo",
        size: null,
        type: null,
        storagePath: logoPath,
        preview: logoPreview,
        persisted: true,
        file: null,
      },
    ];
  }

  const storedReferences =
    await getBrandReferenceAssets(
      brandSettingsId,
    );

  const referenceImages = await Promise.all(
    storedReferences.map(mapStoredAsset),
  );

  return {
    logo,
    referenceImages,
  };
}

export function useBrandAssets({
  brandSettingsId,
  workspaceId,
  logoPath,
}) {
  const [assets, setAssets] = useState(EMPTY_ASSETS);
  const [isLoadingAssets, setIsLoadingAssets] =
    useState(false);
  const [isSavingAssets, setIsSavingAssets] =
    useState(false);
  const [assetsError, setAssetsError] = useState(null);

  const loadAssets = useCallback(async () => {
    if (!brandSettingsId) {
      setAssets(EMPTY_ASSETS);
      setIsLoadingAssets(false);
      return EMPTY_ASSETS;
    }

    setIsLoadingAssets(true);
    setAssetsError(null);

    try {
      const loadedAssets = await loadStoredAssets({
        brandSettingsId,
        logoPath,
      });

      setAssets(loadedAssets);

      return loadedAssets;
    } catch (loadError) {
      const message =
        loadError.message ||
        "Unable to load brand assets.";

      setAssetsError(message);
      return null;
    } finally {
      setIsLoadingAssets(false);
    }
  }, [brandSettingsId, logoPath]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const saveAssets = useCallback(
    async ({
      nextLogo = [],
      nextReferenceImages = [],
    }) => {
      if (!brandSettingsId) {
        setAssetsError(
          "Brand settings ID is required.",
        );
        return null;
      }

      if (!workspaceId) {
        setAssetsError(
          "Workspace ID is required.",
        );
        return null;
      }

      setIsSavingAssets(true);
      setAssetsError(null);

      try {
        const currentLogo = assets.logo[0] || null;
        const desiredLogo = nextLogo[0] || null;
        let finalLogoPath =
          currentLogo?.storagePath || null;

        const logoWasRemoved =
          currentLogo &&
          !desiredLogo;

        const logoWasReplaced =
          desiredLogo?.file &&
          !desiredLogo.persisted;

        if (logoWasReplaced) {
          const uploadedLogo =
            await uploadBrandAsset({
              workspaceId,
              assetType: "logo",
              file: desiredLogo.file,
            });

          try {
            await updateBrandLogo({
              brandSettingsId,
              logoPath:
                uploadedLogo.storagePath,
            });
          } catch (updateError) {
            await removeBrandAsset(
              uploadedLogo.storagePath,
            );

            throw updateError;
          }

          finalLogoPath =
            uploadedLogo.storagePath;

          if (
            currentLogo?.storagePath &&
            currentLogo.storagePath !==
              finalLogoPath
          ) {
            await removeBrandAsset(
              currentLogo.storagePath,
            );
          }
        } else if (logoWasRemoved) {
          await updateBrandLogo({
            brandSettingsId,
            logoPath: null,
          });

          finalLogoPath = null;

          if (currentLogo.storagePath) {
            await removeBrandAsset(
              currentLogo.storagePath,
            );
          }
        }

        const desiredPersistedIds = new Set(
          nextReferenceImages
            .filter(
              (item) =>
                item.persisted && item.id,
            )
            .map((item) => item.id),
        );

        const removedReferences =
          assets.referenceImages.filter(
            (item) =>
              item.persisted &&
              item.id &&
              !desiredPersistedIds.has(item.id),
          );

        for (const asset of removedReferences) {
          await deleteBrandReferenceAsset(
            asset.id,
          );

          if (asset.storagePath) {
            await removeBrandAsset(
              asset.storagePath,
            );
          }
        }

        const newReferences =
          nextReferenceImages.filter(
            (item) =>
              item.file && !item.persisted,
          );

        for (const asset of newReferences) {
          const uploadedAsset =
            await uploadBrandAsset({
              workspaceId,
              assetType: "references",
              file: asset.file,
            });

          try {
            await createBrandReferenceAsset({
              brandSettingsId,
              storagePath:
                uploadedAsset.storagePath,
              fileName:
                uploadedAsset.fileName,
              mimeType:
                uploadedAsset.mimeType,
              fileSize:
                uploadedAsset.fileSize,
            });
          } catch (insertError) {
            await removeBrandAsset(
              uploadedAsset.storagePath,
            );

            throw insertError;
          }
        }

        const refreshedAssets =
          await loadStoredAssets({
            brandSettingsId,
            logoPath: finalLogoPath,
          });

        setAssets(refreshedAssets);

        return refreshedAssets;
      } catch (saveError) {
        setAssetsError(
          saveError.message ||
            "Unable to save brand assets.",
        );

        return null;
      } finally {
        setIsSavingAssets(false);
      }
    },
    [
      assets,
      brandSettingsId,
      workspaceId,
    ],
  );

  return {
    assets,
    setAssets,
    isLoadingAssets,
    isSavingAssets,
    assetsError,
    saveAssets,
    reloadAssets: loadAssets,
  };
}

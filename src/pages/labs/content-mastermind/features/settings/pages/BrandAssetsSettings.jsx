import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import TextField from "../components/fields/TextField";
import SelectField from "../components/fields/SelectField";
import ColorField from "../components/fields/ColorField";
import UploadField from "../components/fields/UploadField";
import SaveBar from "../components/SaveBar";
import Spinner from "../../../shared/components/Spinner";
import { ToastViewport } from "../../../shared/components/Toast";

import { useBrandSettings } from "../hooks/useBrandSettings";
import { useBrandAssets } from "../hooks/useBrandAssets";

const WORKSPACE_ID =
  "218d4adc-c7c7-4759-965a-3e37c2fda15d";

const EMPTY_UPLOADS = {
  logo: [],
  referenceImages: [],
};

const visualDirectionOptions = [
  { value: "", label: "Not configured" },
  {
    value: "character-animation-2d",
    label: "Character Animation (2D)",
  },
  {
    value: "flat-vector",
    label: "Flat Vector",
  },
  {
    value: "editorial",
    label: "Editorial Illustration",
  },
  {
    value: "corporate",
    label: "Corporate Illustration",
  },
  {
    value: "minimal",
    label: "Minimal",
  },
  {
    value: "comic-book",
    label: "Comic Book",
  },
  {
    value: "three-dimensional",
    label: "3D",
  },
  {
    value: "photorealistic",
    label: "Photorealistic",
  },
];

function createPreviewFiles(files) {
  return files.map((file) => ({
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    preview: URL.createObjectURL(file),
  }));
}

function revokePreview(fileItem) {
  if (fileItem?.preview?.startsWith("blob:")) {
    URL.revokeObjectURL(fileItem.preview);
  }
}

function revokePreviewFiles(files = []) {
  files.forEach(revokePreview);
}

function hasPreview(files, preview) {
  return files.some((item) => item.preview === preview);
}

function getComparableUploads(uploads) {
  return {
    logo: uploads.logo.map((item) => ({
      name: item.name,
      size: item.size,
      type: item.type,
      preview: item.preview,
    })),
    referenceImages: uploads.referenceImages.map((item) => ({
      name: item.name,
      size: item.size,
      type: item.type,
      preview: item.preview,
    })),
  };
}

function createToastId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function BrandAssetsSettings() {
  const [toasts, setToasts] = useState([]);
  const dismissTimers = useRef(new Map());
  const lastErrorRef = useRef(null);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );

    const timerId = dismissTimers.current.get(toastId);

    if (timerId) {
      window.clearTimeout(timerId);
      dismissTimers.current.delete(toastId);
    }
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 3500 }) => {
      const id = createToastId();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          type,
          title,
          message,
        },
      ]);

      const timerId = window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      dismissTimers.current.set(id, timerId);
    },
    [dismissToast]
  );

  const {
    brand,
    isLoading,
    isSaving,
    isDirty: brandIsDirty,
    error,
    updateField,
    saveChanges,
    cancelChanges,
  } = useBrandSettings(WORKSPACE_ID);

  const {
    assets: storedAssets,
    isLoadingAssets,
    isSavingAssets,
    assetsError,
    saveAssets,
  } = useBrandAssets({
    brandSettingsId: brand.id,
    workspaceId: brand.workspaceId || WORKSPACE_ID,
    logoPath: brand.logoPath,
  });

  const [uploads, setUploads] = useState(EMPTY_UPLOADS);
  const [savedUploads, setSavedUploads] = useState(EMPTY_UPLOADS);

  const uploadsRef = useRef(uploads);
  const savedUploadsRef = useRef(savedUploads);
  const assetsInitializedRef = useRef(false);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    const timers = dismissTimers.current;

    return () => {
      timers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });

      timers.clear();
    };
  }, []);

  useEffect(() => {
    const currentError = error || assetsError;

    if (!currentError || currentError === lastErrorRef.current) {
      return;
    }

    lastErrorRef.current = currentError;

    showToast({
      type: "error",
      title: "Unable to save",
      message: currentError,
      duration: 5000,
    });
  }, [error, assetsError, showToast]);

  useEffect(() => {
    savedUploadsRef.current = savedUploads;
  }, [savedUploads]);

  useEffect(() => {
    return () => {
      const currentUploads = uploadsRef.current;
      const currentSavedUploads = savedUploadsRef.current;

      const previews = new Set();

      [
        ...currentUploads.logo,
        ...currentUploads.referenceImages,
        ...currentSavedUploads.logo,
        ...currentSavedUploads.referenceImages,
      ].forEach((item) => {
        if (item?.preview) {
          previews.add(item.preview);
        }
      });

      previews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    assetsInitializedRef.current = false;
  }, [brand.id]);

  useEffect(() => {
    if (
      !brand.id ||
      isLoadingAssets ||
      assetsInitializedRef.current
    ) {
      return;
    }

    const loadedAssets = {
      logo: [...storedAssets.logo],
      referenceImages: [
        ...storedAssets.referenceImages,
      ],
    };

    setUploads(loadedAssets);
    setSavedUploads(loadedAssets);

    assetsInitializedRef.current = true;
  }, [
    brand.id,
    storedAssets,
    isLoadingAssets,
  ]);

  const uploadsAreDirty = useMemo(() => {
    const currentUploads = getComparableUploads(uploads);
    const storedUploads = getComparableUploads(savedUploads);

    return (
      JSON.stringify(currentUploads) !==
      JSON.stringify(storedUploads)
    );
  }, [uploads, savedUploads]);

  const dirty = brandIsDirty || uploadsAreDirty;
  const saving = isSaving || isSavingAssets;

  const brandAssets = useMemo(
    () => ({
      ...brand,
      logo: uploads.logo,
      referenceImages: uploads.referenceImages,
    }),
    [brand, uploads],
  );

  const configuredAssets = useMemo(
    () => [
      {
        label: "Brand name",
        configured: Boolean(brandAssets.brandName.trim()),
      },
      {
        label: "Brand colors",
        configured: Boolean(
          brandAssets.primaryColor ||
            brandAssets.secondaryColor ||
            brandAssets.accentColor,
        ),
      },
      {
        label: "Visual direction",
        configured: Boolean(brandAssets.visualDirection),
      },
      {
        label: "Logo",
        configured: brandAssets.logo.length > 0,
      },
      {
        label: "Reference images",
        configured: brandAssets.referenceImages.length > 0,
      },
    ],
    [brandAssets],
  );

  const configuredCount = useMemo(
    () =>
      configuredAssets.filter((asset) => asset.configured).length,
    [configuredAssets],
  );

  const recipeStrength = Math.round(
    (configuredCount / configuredAssets.length) * 100,
  );

  const selectedVisualDirection = useMemo(
    () =>
      visualDirectionOptions.find(
        (option) =>
          option.value === brandAssets.visualDirection,
      ),
    [brandAssets.visualDirection],
  );

  const handleChange = (field, value) => {
    updateField(field, value);
  };

  const handleLogoChange = (files) => {
    const nextLogo = createPreviewFiles(files.slice(0, 1));

    setUploads((current) => {
      current.logo.forEach((item) => {
        const belongsToSavedState = hasPreview(
          savedUploads.logo,
          item.preview,
        );

        if (!belongsToSavedState) {
          revokePreview(item);
        }
      });

      return {
        ...current,
        logo: nextLogo,
      };
    });
  };

  const handleReferenceImagesChange = (files) => {
    const nextImages = createPreviewFiles(files);

    setUploads((current) => ({
      ...current,
      referenceImages: [
        ...current.referenceImages,
        ...nextImages,
      ],
    }));
  };

  const handleRemoveLogo = () => {
    setUploads((current) => {
      current.logo.forEach((item) => {
        const belongsToSavedState = hasPreview(
          savedUploads.logo,
          item.preview,
        );

        if (!belongsToSavedState) {
          revokePreview(item);
        }
      });

      return {
        ...current,
        logo: [],
      };
    });
  };

  const handleRemoveReferenceImage = (index) => {
    setUploads((current) => {
      const imageToRemove = current.referenceImages[index];

      const belongsToSavedState = hasPreview(
        savedUploads.referenceImages,
        imageToRemove?.preview,
      );

      if (!belongsToSavedState) {
        revokePreview(imageToRemove);
      }

      return {
        ...current,
        referenceImages:
          current.referenceImages.filter(
            (_, currentIndex) => currentIndex !== index,
          ),
      };
    });
  };

  const handleCancel = () => {
    cancelChanges();

    setUploads((current) => {
      current.logo.forEach((item) => {
        if (!hasPreview(savedUploads.logo, item.preview)) {
          revokePreview(item);
        }
      });

      current.referenceImages.forEach((item) => {
        if (
          !hasPreview(
            savedUploads.referenceImages,
            item.preview,
          )
        ) {
          revokePreview(item);
        }
      });

      return {
        logo: [...savedUploads.logo],
        referenceImages: [
          ...savedUploads.referenceImages,
        ],
      };
    });
  };

  const handleSave = async () => {
    if (!dirty || saving) {
      return;
    }

    let savedBrand = brand;

    if (brandIsDirty) {
      savedBrand = await saveChanges();

      if (!savedBrand) {
        return;
      }
    }

    let savedAssets = {
      logo: [...uploads.logo],
      referenceImages: [...uploads.referenceImages],
    };

    if (uploadsAreDirty) {
      savedAssets = await saveAssets({
        nextLogo: uploads.logo,
        nextReferenceImages: uploads.referenceImages,
      });

      if (!savedAssets) {
        return;
      }
    }

    savedUploads.logo.forEach((item) => {
      if (!hasPreview(savedAssets.logo, item.preview)) {
        revokePreview(item);
      }
    });

    savedUploads.referenceImages.forEach((item) => {
      if (
        !hasPreview(
          savedAssets.referenceImages,
          item.preview,
        )
      ) {
        revokePreview(item);
      }
    });

    setUploads({
      logo: [...savedAssets.logo],
      referenceImages: [
        ...savedAssets.referenceImages,
      ],
    });

    setSavedUploads({
      logo: [...savedAssets.logo],
      referenceImages: [
        ...savedAssets.referenceImages,
      ],
    });

    lastErrorRef.current = null;

    showToast({
      type: "success",
      title: "Changes saved",
      message:
        "Brand settings and visual references were saved successfully.",
    });
  };

  if (isLoading || isLoadingAssets) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
      />

      <section className="p-6 lg:p-8">
        <header className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Brand Assets
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Configure optional visual references for generated
            content and images. More complete information produces
            more consistent results, but no field is required.
          </p>
        </header>

        {(error || assetsError) && (
          <div
            role="alert"
            className="mt-6 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <p className="text-sm font-medium text-red-800">
              Unable to load or update brand settings
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error || assetsError}
            </p>
          </div>
        )}

        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="max-w-3xl space-y-10">
            <section>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Brand identity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Basic information used to identify your brand.
                </p>
              </div>

              <div className="mt-6 grid gap-6">
                <TextField
                  label="Brand Name"
                  name="brandName"
                  value={brandAssets.brandName}
                  placeholder="Content Mastermind"
                  onChange={handleChange}
                />
              </div>
            </section>

            <section>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Visual assets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload optional references that help maintain
                  visual consistency.
                </p>
              </div>

              <div className="mt-6 space-y-8">
                <UploadField
                  label="Logo"
                  description="Used as a visual brand reference. It will not automatically be placed in every generated image."
                  files={brandAssets.logo}
                  onChange={handleLogoChange}
                  onRemove={handleRemoveLogo}
                />

                <UploadField
                  label="Reference Images"
                  description="Upload characters, illustration examples, compositions or other visual references."
                  multiple
                  files={brandAssets.referenceImages}
                  onChange={handleReferenceImagesChange}
                  onRemove={handleRemoveReferenceImage}
                />
              </div>
            </section>

            <section>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Brand colors
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  These colors may be incorporated into AI-generated
                  visual assets.
                </p>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ColorField
                  label="Primary"
                  name="primaryColor"
                  value={brandAssets.primaryColor}
                  onChange={handleChange}
                />

                <ColorField
                  label="Secondary"
                  name="secondaryColor"
                  value={brandAssets.secondaryColor}
                  onChange={handleChange}
                />

                <ColorField
                  label="Accent"
                  name="accentColor"
                  value={brandAssets.accentColor}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Illustration
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define a preferred visual direction for image
                  generation.
                </p>
              </div>

              <div className="mt-6">
                <SelectField
                  label="Visual Direction"
                  name="visualDirection"
                  value={brandAssets.visualDirection}
                  options={visualDirectionOptions}
                  onChange={handleChange}
                />
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 xl:sticky xl:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Creative Recipe
            </p>

            <h2 className="mt-3 text-lg font-semibold text-slate-900">
              Available ingredients
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Only configured assets will be included when building
              prompts.
            </p>

            <div className="mt-6 space-y-3">
              {configuredAssets.map((asset) => (
                <div
                  key={asset.label}
                  className="flex items-center justify-between gap-4"
                >
                  <span
                    className={
                      asset.configured
                        ? "text-sm text-slate-900"
                        : "text-sm text-slate-400"
                    }
                  >
                    {asset.label}
                  </span>

                  <span
                    className={
                      asset.configured
                        ? "text-xs font-semibold uppercase tracking-wide text-green-700"
                        : "text-xs font-semibold uppercase tracking-wide text-slate-400"
                    }
                  >
                    {asset.configured
                      ? "Ready"
                      : "Optional"}
                  </span>
                </div>
              ))}
            </div>

            {brandAssets.referenceImages.length > 0 && (
              <p className="mt-4 text-xs leading-5 text-slate-500">
                {brandAssets.referenceImages.length} reference{" "}
                {brandAssets.referenceImages.length === 1
                  ? "image"
                  : "images"}{" "}
                available.
              </p>
            )}

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700">
                  Recipe strength
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {recipeStrength}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-300"
                  style={{
                    width: `${recipeStrength}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                {recipeStrength === 100
                  ? "Your creative recipe contains all available brand ingredients."
                  : "Add more optional ingredients to improve visual consistency."}
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex h-20">
                <div
                  className="flex-1"
                  style={{
                    backgroundColor:
                      brandAssets.primaryColor,
                  }}
                />

                <div
                  className="flex-1"
                  style={{
                    backgroundColor:
                      brandAssets.secondaryColor,
                  }}
                />

                <div
                  className="flex-1"
                  style={{
                    backgroundColor:
                      brandAssets.accentColor,
                  }}
                />
              </div>

              <div className="p-4">
                <p className="font-medium text-slate-900">
                  {brandAssets.brandName || "Brand preview"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedVisualDirection?.value
                    ? selectedVisualDirection.label
                    : "No visual direction selected"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SaveBar
        dirty={dirty}
        saving={saving}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </>
  );
}
import { ImageSquare, UploadSimple, X } from "@phosphor-icons/react";

import Button from "../../../../shared/components/Button";

export default function UploadField({
  label,
  description,
  accept = "image/*",
  multiple = false,
  files = [],
  onChange,
  onRemove,
}) {
  const handleInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    onChange(selectedFiles);
    event.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <label
        className="
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          gap-4
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
          px-6
          py-8
          text-center
          transition
          hover:border-black
          hover:bg-white
        "
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="sr-only"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white">
          <UploadSimple size={22} />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">
            Upload {multiple ? "images" : "image"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG or WEBP
          </p>
        </div>
      </label>

      {files.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="relative aspect-video bg-slate-100">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ImageSquare size={30} />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="
                    absolute
                    right-2
                    top-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    text-slate-700
                    shadow-sm
                    transition
                    hover:border-black
                    hover:text-black
                  "
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3">
                <p className="truncate text-sm font-medium text-slate-900">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
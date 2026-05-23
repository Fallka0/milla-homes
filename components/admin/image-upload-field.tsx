"use client";

import { ChangeEvent, useRef, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const maxUploadSizeBytes = 50 * 1024 * 1024;

type ImageUploadFieldProps = {
  accept?: string;
  defaultValue?: string;
  label: string;
  mode: "gallery" | "single";
  name: string;
  placeholder: string;
  required?: boolean;
  title: string;
  uploadCopy: {
    compressingImage: string;
    convertingImage: string;
    fileTooLarge: string;
    imageUploaded: string;
    uploadFailed: string;
    uploadGallery: string;
    uploadImage: string;
    uploading: string;
    uploadedCount: string;
    videoTooLarge: string;
  };
};

type UploadState = {
  message: string;
  type: "error" | "idle" | "success";
};

const initialState: UploadState = {
  message: "",
  type: "idle",
};

function replaceFileExtension(fileName: string, extension: string) {
  const sanitizedExtension = extension.replace(/^\./, "");
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");

  return `${withoutExtension}.${sanitizedExtension}`;
}

async function loadImageElement(file: File) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not load image for compression."));
      image.src = objectUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function renderCanvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function compressImageFile(file: File) {
  const image = await loadImageElement(file);
  const originalWidth = "width" in image ? image.width : 0;
  const originalHeight = "height" in image ? image.height : 0;

  if (!originalWidth || !originalHeight) {
    throw new Error("Could not read image dimensions.");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Image compression is not supported in this browser.");
  }

  try {
    const scaleSteps = [1, 0.9, 0.8, 0.7, 0.6, 0.5];
    const qualitySteps = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46];

    for (const scale of scaleSteps) {
      canvas.width = Math.max(1, Math.round(originalWidth * scale));
      canvas.height = Math.max(1, Math.round(originalHeight * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of qualitySteps) {
        const blob =
          (await renderCanvasToBlob(canvas, "image/webp", quality)) ??
          (await renderCanvasToBlob(canvas, "image/jpeg", quality));

        if (!blob) {
          continue;
        }

        if (blob.size <= maxUploadSizeBytes) {
          const arrayBuffer = await blob.arrayBuffer();

          return new File([arrayBuffer], replaceFileExtension(file.name, "webp"), {
            type: blob.type || "image/webp",
            lastModified: Date.now(),
          });
        }
      }
    }
  } finally {
    if ("close" in image && typeof image.close === "function") {
      image.close();
    }
  }

  throw new Error("This image is still larger than 50 MB after compression.");
}

function isHeicFile(file: File) {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)
  );
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const blob = Array.isArray(result) ? result[0] : result;

  return new File([blob], replaceFileExtension(file.name, "jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export function ImageUploadField({
  accept = "image/*",
  defaultValue = "",
  label,
  mode,
  name,
  placeholder,
  required = false,
  title,
  uploadCopy,
}: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState(initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    const response = await fetch("/api/admin/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType: file.type,
        fileName: file.name,
        title,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      bucketName?: string;
      error?: string;
      path?: string;
      token?: string;
      url?: string;
    };

    if (!response.ok || !data.url || !data.bucketName || !data.path || !data.token) {
      throw new Error(data.error ?? uploadCopy.uploadFailed);
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Supabase browser upload is not configured.");
    }

    const { error: uploadError } = await supabase.storage
      .from(data.bucketName)
      .uploadToSignedUrl(data.path, data.token, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    return data.url;
  }

  async function prepareFile(file: File) {
    let processedFile = file;

    if (isHeicFile(file)) {
      setUploadState({ message: uploadCopy.convertingImage, type: "idle" });
      processedFile = await convertHeicToJpeg(file);
    }

    if (processedFile.size <= maxUploadSizeBytes) {
      return processedFile;
    }

    if (processedFile.type.startsWith("image/")) {
      setUploadState({
        message: uploadCopy.compressingImage,
        type: "idle",
      });

      return compressImageFile(processedFile);
    }

    if (processedFile.type.startsWith("video/")) {
      throw new Error(uploadCopy.videoTooLarge);
    }

    throw new Error(uploadCopy.fileTooLarge);
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadState(initialState);

    try {
      const urls: string[] = [];

      for (const file of files) {
        const preparedFile = await prepareFile(file);

        if (preparedFile.size > maxUploadSizeBytes) {
          throw new Error(uploadCopy.fileTooLarge);
        }

        setUploadState({
          message: uploadCopy.uploading,
          type: "idle",
        });

        urls.push(await uploadFile(preparedFile));
      }

      if (mode === "single") {
        setValue(urls[0] ?? value);
      } else {
        setValue((currentValue) => [currentValue.trim(), ...urls].filter(Boolean).join("\n"));
      }

      setUploadState({
        message:
          mode === "single"
            ? uploadCopy.imageUploaded
            : uploadCopy.uploadedCount.replace("{count}", String(urls.length)),
        type: "success",
      });
    } catch (error) {
      setUploadState({
        message: error instanceof Error ? error.message : uploadCopy.uploadFailed,
        type: "error",
      });
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="admin-upload-field">
      <label>
        {label}
        <input name={name} type="hidden" value={value} />
        {mode === "single" ? (
          <input
            type="url"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            required={required}
          />
        ) : (
          <textarea
            rows={6}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
          />
        )}
      </label>

      <div className="admin-upload-row">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={mode === "gallery"}
          onChange={handleUpload}
        />
        <span>{isUploading ? uploadCopy.uploading : mode === "single" ? uploadCopy.uploadImage : uploadCopy.uploadGallery}</span>
      </div>

      <p className={`form-status ${uploadState.type}`}>{uploadState.message}</p>
    </div>
  );
}

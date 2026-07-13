"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/documents/constants";

type UploadItem = {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
};

type DocumentUploadZoneProps = {
  disabled?: boolean;
  onUploadFiles: (files: File[]) => Promise<void>;
};

const ACCEPT = ALLOWED_DOCUMENT_EXTENSIONS.join(",");

export default function DocumentUploadZone({
  disabled = false,
  onUploadFiles,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const isUploading = uploads.some((item) => item.status === "uploading");

  const startUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0 || disabled || isUploading) return;

      const items: UploadItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        progress: 0,
        status: "uploading",
      }));

      setUploads(items);

      const progressInterval = window.setInterval(() => {
        setUploads((current) =>
          current.map((item) =>
            item.status === "uploading" && item.progress < 90
              ? { ...item, progress: item.progress + 10 }
              : item
          )
        );
      }, 200);

      try {
        await onUploadFiles(files);

        window.clearInterval(progressInterval);
        setUploads((current) =>
          current.map((item) => ({
            ...item,
            progress: 100,
            status: "complete",
          }))
        );

        window.setTimeout(() => setUploads([]), 1500);
      } catch (error) {
        window.clearInterval(progressInterval);
        const message =
          error instanceof Error ? error.message : "Upload failed.";

        setUploads((current) =>
          current.map((item) => ({
            ...item,
            status: "error",
            error: message,
          }))
        );
      }
    },
    [disabled, isUploading, onUploadFiles]
  );

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);

    for (const file of files) {
      if (file.size === 0) {
        setUploads([
          {
            id: crypto.randomUUID(),
            name: file.name,
            progress: 0,
            status: "error",
            error: "The selected file is empty.",
          },
        ]);
        return;
      }

      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        setUploads([
          {
            id: crypto.randomUUID(),
            name: file.name,
            progress: 0,
            status: "error",
            error: "File exceeds the 20MB size limit.",
          },
        ]);
        return;
      }

      const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;

      if (
        !ALLOWED_DOCUMENT_EXTENSIONS.includes(
          extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number]
        )
      ) {
        setUploads([
          {
            id: crypto.randomUUID(),
            name: file.name,
            progress: 0,
            status: "error",
            error: "Unsupported file type. Upload PDF, DOCX, TXT, or MD files.",
          },
        ]);
        return;
      }
    }

    void startUpload(files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled && !isUploading) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled && !isUploading) {
            handleFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-white/10 bg-background/20",
          (disabled || isUploading) && "pointer-events-none opacity-60"
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {isUploading ? (
            <Loader2
              className="h-7 w-7 animate-spin text-primary"
              aria-hidden="true"
            />
          ) : (
            <Upload className="h-7 w-7 text-primary" aria-hidden="true" />
          )}
        </div>
        <p className="text-sm font-medium text-white">
          Drag & drop documents here
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          PDF, DOCX, TXT, or MD · Max 20MB per file · Multiple files supported
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <FileUp className="h-4 w-4" aria-hidden="true" />
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {uploads.length > 0 && (
        <ul className="space-y-2">
          {uploads.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-sm text-white">{item.name}</p>
                <span className="text-xs text-muted">
                  {item.status === "complete"
                    ? "Complete"
                    : item.status === "error"
                      ? "Failed"
                      : `${item.progress}%`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-200",
                    item.status === "error"
                      ? "bg-red-500"
                      : item.status === "complete"
                        ? "bg-green-500"
                        : "bg-primary"
                  )}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              {item.error && (
                <p className="mt-2 text-xs text-red-400" role="alert">
                  {item.error}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

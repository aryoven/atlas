"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/documents/constants";

type OnboardingFilePickerProps = {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
};

const ACCEPT = ALLOWED_DOCUMENT_EXTENSIONS.join(",");

function isAllowedExtension(filename: string): boolean {
  const extension = `.${filename.split(".").pop()?.toLowerCase() ?? ""}`;
  return ALLOWED_DOCUMENT_EXTENSIONS.includes(
    extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number]
  );
}

export default function OnboardingFilePicker({
  files,
  onChange,
  disabled = false,
}: OnboardingFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return;

      setError(null);
      const next: File[] = [...files];

      for (const file of Array.from(fileList)) {
        if (file.size === 0) {
          setError(`${file.name} is empty.`);
          return;
        }

        if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
          setError(`${file.name} exceeds the 20MB limit.`);
          return;
        }

        if (!isAllowedExtension(file.name)) {
          setError("Upload PDF, DOCX, TXT, or MD files only.");
          return;
        }

        const alreadyAdded = next.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );

        if (!alreadyAdded) {
          next.push(file);
        }
      }

      onChange(next);
    },
    [disabled, files, onChange]
  );

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-white/10 bg-background/20",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-7 w-7 text-primary" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-white">
          Upload PDFs, DOCX or TXT files to teach your AI Employee.
        </p>
        <p className="mt-2 text-sm text-muted">Drag & drop or browse files</p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
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
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Selected files">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <span className="truncate text-sm text-white">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-white/10 hover:text-white"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

type DeleteDocumentDialogProps = {
  open: boolean;
  filename: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteDocumentDialog({
  open,
  filename,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteDocumentDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-document-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close dialog"
        disabled={isDeleting}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f1a] p-6 shadow-2xl">
        <h2
          id="delete-document-title"
          className="text-lg font-semibold text-white"
        >
          Delete Document
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Are you sure you want to delete{" "}
          <span className="font-medium text-white">{filename}</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 shadow-red-600/25"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              "Delete Document"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/lib/types/employee";
import type { EmployeeDocument } from "@/lib/types/employee-document";
import {
  uploadEmployeeDocument,
  deleteEmployeeDocument,
} from "@/app/actions/documents";
import { MAX_DOCUMENT_SIZE_BYTES } from "@/lib/documents/constants";
import DocumentUploadZone from "@/components/dashboard/employee/DocumentUploadZone";
import DocumentList from "@/components/dashboard/employee/DocumentList";
import DeleteDocumentDialog from "@/components/dashboard/employee/DeleteDocumentDialog";

type EmployeeKnowledgeBaseProps = {
  employee: Employee;
  initialDocuments: EmployeeDocument[];
};

export default function EmployeeKnowledgeBase({
  employee,
  initialDocuments,
}: EmployeeKnowledgeBaseProps) {
  const router = useRouter();
  const [documents, setDocuments] =
    useState<EmployeeDocument[]>(initialDocuments);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] =
    useState<EmployeeDocument | null>(null);
  const [, startTransition] = useTransition();

  const refreshDocuments = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleUploadFiles = async (files: File[]) => {
    setError(null);

    for (const file of files) {
      if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
        throw new Error(`${file.name} exceeds the 20MB size limit.`);
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadEmployeeDocument(employee.id, formData);

      if ("error" in result) {
        throw new Error(result.error);
      }

      setDocuments((current) => [result.document, ...current]);
    }

    refreshDocuments();
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setDeletingId(documentToDelete.id);
    setError(null);

    const result = await deleteEmployeeDocument(
      employee.id,
      documentToDelete.id
    );

    if ("error" in result) {
      setError(result.error);
      setDeletingId(null);
      setDocumentToDelete(null);
      return;
    }

    setDocuments((current) =>
      current.filter((document) => document.id !== documentToDelete.id)
    );
    setDeletingId(null);
    setDocumentToDelete(null);
    refreshDocuments();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Knowledge</h2>
        <p className="mt-1 text-sm text-muted">
          Upload company documents for this AI Employee. Files are indexed for
          semantic retrieval and cited in chat responses when relevant.
        </p>
      </div>

      <DocumentUploadZone onUploadFiles={handleUploadFiles} />

      <div className="mt-8">
        {documents.length > 0 ? (
          <DocumentList
            documents={documents}
            deletingId={deletingId}
            onDelete={setDocumentToDelete}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-background/20 px-6 py-10 text-center">
            <p className="text-sm text-muted">
              No documents uploaded yet. Add knowledge files to power grounded
              answers in chat.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}

      <DeleteDocumentDialog
        open={documentToDelete !== null}
        filename={documentToDelete?.filename ?? ""}
        isDeleting={deletingId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          if (!deletingId) setDocumentToDelete(null);
        }}
      />
    </div>
  );
}

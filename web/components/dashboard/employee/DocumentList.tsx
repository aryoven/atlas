import {
  FileText,
  FileType,
  File,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { EmployeeDocument } from "@/lib/types/employee-document";
import { DOCUMENT_PROCESSING_STATUS } from "@/lib/documents/constants";
import { formatEmployeeDate } from "@/lib/utils/employee";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type DocumentListProps = {
  documents: EmployeeDocument[];
  deletingId: string | null;
  onDelete: (document: EmployeeDocument) => void;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocumentIcon(filename: string) {
  const lower = filename.toLowerCase();

  if (lower.endsWith(".pdf")) {
    return FileText;
  }

  if (lower.endsWith(".docx")) {
    return FileType;
  }

  return File;
}

function getStatusBadge(document: EmployeeDocument) {
  if (document.processing_status === DOCUMENT_PROCESSING_STATUS.processing) {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
        Processing
      </Badge>
    );
  }

  if (document.processing_status === DOCUMENT_PROCESSING_STATUS.failed) {
    return (
      <Badge className="border-red-500/30 bg-red-500/10 text-red-300">
        Failed
      </Badge>
    );
  }

  return (
    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
      Ready
    </Badge>
  );
}

export default function DocumentList({
  documents,
  deletingId,
  onDelete,
}: DocumentListProps) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white">
        Uploaded Documents ({documents.length})
      </h3>
      <ul className="space-y-2">
        {documents.map((document) => {
          const Icon = getDocumentIcon(document.filename);
          const isDeleting = deletingId === document.id;
          const isFailed =
            document.processing_status === DOCUMENT_PROCESSING_STATUS.failed;

          return (
            <li
              key={document.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-white">
                      {document.filename}
                    </p>
                    {getStatusBadge(document)}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatFileSize(document.size)} ·{" "}
                    {formatEmployeeDate(document.created_at)}
                  </p>
                  {isFailed && document.processing_error && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-red-400">
                      <AlertCircle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      {document.processing_error}
                    </p>
                  )}
                  {document.processing_status ===
                    DOCUMENT_PROCESSING_STATUS.ready && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-emerald-400"
                        aria-hidden="true"
                      />
                      Available for semantic retrieval in chat.
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted hover:text-red-400"
                  onClick={() => onDelete(document)}
                  disabled={isDeleting}
                  aria-label={`Delete ${document.filename}`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

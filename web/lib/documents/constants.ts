export const EMPLOYEE_DOCUMENTS_BUCKET = "employee-documents";

export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".md",
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
] as const;

export type AllowedDocumentExtension =
  (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number];

export type AllowedDocumentMimeType =
  (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number];

/** Characters per document chunk before embedding. */
export const DOCUMENT_CHUNK_SIZE = 900;

/** Overlap between adjacent document chunks. */
export const DOCUMENT_CHUNK_OVERLAP = 150;

export const DOCUMENT_PROCESSING_STATUS = {
  processing: "processing",
  ready: "ready",
  failed: "failed",
} as const;

export type DocumentProcessingStatus =
  (typeof DOCUMENT_PROCESSING_STATUS)[keyof typeof DOCUMENT_PROCESSING_STATUS];

import mammoth from "mammoth";
import {
  ALLOWED_DOCUMENT_EXTENSIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
} from "@/lib/documents/constants";

type PdfParseResult = {
  text: string;
};

type PdfParseFn = (buffer: Buffer) => Promise<PdfParseResult>;

function getExtension(filename: string): string {
  const index = filename.lastIndexOf(".");
  return index >= 0 ? filename.slice(index).toLowerCase() : "";
}

function isTextDocument(mimeType: string, extension: string): boolean {
  return (
    mimeType === "text/plain" ||
    mimeType === "text/markdown" ||
    extension === ".txt" ||
    extension === ".md"
  );
}

function isPdfDocument(mimeType: string, extension: string): boolean {
  return mimeType === "application/pdf" || extension === ".pdf";
}

function isDocxDocument(mimeType: string, extension: string): boolean {
  return (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  );
}

export function isAllowedDocumentType(
  mimeType: string,
  filename: string
): boolean {
  const extension = getExtension(filename);
  const normalizedMime = mimeType.toLowerCase();

  if (
    ALLOWED_DOCUMENT_MIME_TYPES.includes(
      normalizedMime as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number]
    )
  ) {
    return true;
  }

  return ALLOWED_DOCUMENT_EXTENSIONS.includes(
    extension as (typeof ALLOWED_DOCUMENT_EXTENSIONS)[number]
  );
}

/**
 * Extracts plain text from supported knowledge-base documents.
 * Designed for a future RAG pipeline that will chunk and embed this output.
 */
export async function extractDocumentText(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const extension = getExtension(filename);
  const normalizedMime = mimeType.toLowerCase();

  if (isTextDocument(normalizedMime, extension)) {
    return buffer.toString("utf-8").trim();
  }

  if (isPdfDocument(normalizedMime, extension)) {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default as PdfParseFn;
    const result = await pdfParse(buffer);
    return result.text.trim();
  }

  if (isDocxDocument(normalizedMime, extension)) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  throw new Error(
    "Unsupported document type. Upload PDF, DOCX, TXT, or MD files."
  );
}

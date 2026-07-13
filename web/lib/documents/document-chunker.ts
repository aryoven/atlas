import {
  DOCUMENT_CHUNK_OVERLAP,
  DOCUMENT_CHUNK_SIZE,
} from "@/lib/documents/constants";

export type DocumentChunk = {
  content: string;
  chunkIndex: number;
};

export function chunkDocumentText(
  text: string,
  chunkSize = DOCUMENT_CHUNK_SIZE,
  overlap = DOCUMENT_CHUNK_OVERLAP
): DocumentChunk[] {
  const normalizedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalizedText) {
    return [];
  }

  if (chunkSize <= 0) {
    throw new Error(
      "Chunk size must be greater than zero."
    );
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error(
      "Chunk overlap must be greater than or equal to zero and smaller than chunk size."
    );
  }

  const chunks: DocumentChunk[] = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < normalizedText.length) {
    let end = Math.min(
      start + chunkSize,
      normalizedText.length
    );

    if (end < normalizedText.length) {
      const candidate = normalizedText.slice(
        start,
        end
      );

      const paragraphBreak =
        candidate.lastIndexOf("\n\n");

      const sentenceBreak = Math.max(
        candidate.lastIndexOf(". "),
        candidate.lastIndexOf("? "),
        candidate.lastIndexOf("! ")
      );

      const preferredBreak = Math.max(
        paragraphBreak,
        sentenceBreak
      );

      if (preferredBreak > chunkSize * 0.5) {
        end = start + preferredBreak + 1;
      }
    }

    const content = normalizedText
      .slice(start, end)
      .trim();

    if (content) {
      chunks.push({
        content,
        chunkIndex,
      });

      chunkIndex += 1;
    }

    if (end >= normalizedText.length) {
      break;
    }

    const nextStart = end - overlap;

    if (nextStart <= start) {
      start = end;
    } else {
      start = nextStart;
    }
  }

  return chunks;
}
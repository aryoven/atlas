import type { MatchedEmployeeDocumentChunk } from "@/lib/data/employee-document-chunks";
import type { ChatSource } from "@/lib/types/chat";
import { MAX_KNOWLEDGE_CONTEXT_CHARS } from "@/lib/ai/rag-constants";

export function normalizeChunkContent(content: string): string {
  return content.replace(/\s+/g, " ").trim().toLowerCase();
}

export function sortChunksBySimilarity(
  chunks: MatchedEmployeeDocumentChunk[]
): MatchedEmployeeDocumentChunk[] {
  return [...chunks].sort((left, right) => right.similarity - left.similarity);
}

export function dedupeMatchedChunks(
  chunks: MatchedEmployeeDocumentChunk[]
): MatchedEmployeeDocumentChunk[] {
  const seen = new Set<string>();
  const deduped: MatchedEmployeeDocumentChunk[] = [];

  for (const chunk of sortChunksBySimilarity(chunks)) {
    const key = normalizeChunkContent(chunk.content);

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(chunk);
  }

  return deduped;
}

export function buildKnowledgeSources(
  chunks: MatchedEmployeeDocumentChunk[],
  filenameByDocumentId: Map<string, string>
): ChatSource[] {
  const sources: ChatSource[] = [];

  for (const chunk of sortChunksBySimilarity(chunks)) {
    const filename = filenameByDocumentId.get(chunk.document_id);

    if (!filename) {
      continue;
    }

    sources.push({
      documentId: chunk.document_id,
      filename,
      chunkIndex: chunk.chunk_index,
      similarity: chunk.similarity,
    });
  }

  return sources;
}

export function dedupeSourcesByDocument(sources: ChatSource[]): ChatSource[] {
  const bestByDocument = new Map<string, ChatSource>();

  for (const source of sources) {
    const existing = bestByDocument.get(source.documentId);

    if (!existing || source.similarity > existing.similarity) {
      bestByDocument.set(source.documentId, source);
    }
  }

  return Array.from(bestByDocument.values()).sort(
    (left, right) => right.similarity - left.similarity
  );
}

export function buildKnowledgeContext(
  chunks: MatchedEmployeeDocumentChunk[],
  filenameByDocumentId: Map<string, string>
): string {
  if (chunks.length === 0) {
    return "";
  }

  const sections: string[] = [];
  let totalChars = 0;

  for (const [index, chunk] of sortChunksBySimilarity(chunks).entries()) {
    const filename =
      filenameByDocumentId.get(chunk.document_id) ?? "unknown-document";

    const section = `--- BEGIN UNTRUSTED REFERENCE ${index + 1} (${filename}) ---\n${chunk.content}\n--- END UNTRUSTED REFERENCE ${index + 1} ---`;

    if (totalChars + section.length > MAX_KNOWLEDGE_CONTEXT_CHARS) {
      break;
    }

    sections.push(section);
    totalChars += section.length;
  }

  return sections.join("\n\n");
}

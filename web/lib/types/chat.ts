export type ChatRole = "user" | "assistant";

export type ChatSource = {
  documentId: string;
  filename: string;
  chunkIndex: number;
  similarity: number;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
  sources?: ChatSource[] | null;
};

export type ChatMessageInput = {
  role: ChatRole;
  content: string;
};

export type RelevantKnowledgeResult = {
  context: string;
  sources: ChatSource[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isChatSource(value: unknown): value is ChatSource {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.documentId === "string" &&
    typeof value.filename === "string" &&
    typeof value.chunkIndex === "number" &&
    Number.isFinite(value.chunkIndex) &&
    typeof value.similarity === "number" &&
    Number.isFinite(value.similarity)
  );
}

export function parseChatSource(value: unknown): ChatSource | null {
  if (!isRecord(value)) {
    return null;
  }

  const documentId = value.documentId;
  const filename = value.filename;
  const chunkIndex = Number(value.chunkIndex);
  const similarity = Number(value.similarity);

  if (
    typeof documentId !== "string" ||
    typeof filename !== "string" ||
    !Number.isFinite(chunkIndex) ||
    !Number.isFinite(similarity)
  ) {
    return null;
  }

  return {
    documentId,
    filename,
    chunkIndex,
    similarity,
  };
}

export function parseChatSources(value: unknown): ChatSource[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const sources = value
    .map((item) => parseChatSource(item))
    .filter((item): item is ChatSource => item !== null);

  return sources.length > 0 ? sources : null;
}

export function getUniqueSourceFilenames(sources: ChatSource[]): string[] {
  const filenames = new Set<string>();

  for (const source of sources) {
    filenames.add(source.filename);
  }

  return Array.from(filenames);
}

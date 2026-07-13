/** Embedding dimension for Xenova/all-MiniLM-L6-v2. */
export const EMBEDDING_DIMENSION = 384;

/** Default number of chunks retrieved per chat query. */
export const RAG_MATCH_COUNT = 5;

/**
 * Minimum cosine similarity for chunk inclusion.
 * RPC returns similarity as 1 - cosine distance for normalized vectors.
 */
export const RAG_SIMILARITY_THRESHOLD = 0.5;

/** Maximum characters of retrieved knowledge injected into the system prompt. */
export const MAX_KNOWLEDGE_CONTEXT_CHARS = 6000;

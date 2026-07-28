import OpenAI from "openai";
import { EMBEDDING_DIMENSION } from "@/lib/ai/rag-constants";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function createLocalEmbedding(
  text: string
): Promise<number[]> {
  const input = text.trim();

  if (!input) {
    throw new Error("Cannot create embedding for empty text.");
  }

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const embedding = response.data[0].embedding;

  if (embedding.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Embedding dimension mismatch: expected ${EMBEDDING_DIMENSION}, received ${embedding.length}.`
    );
  }

  return embedding;
}
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

  console.log("======================================");
  console.log("🚀 createLocalEmbedding()");
  console.log("Configured dimension:", EMBEDDING_DIMENSION);
  console.log("Input length:", input.length);

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const embedding = response.data[0].embedding;

  console.log("Returned embedding length:", embedding.length);

  if (embedding.length !== EMBEDDING_DIMENSION) {
    console.error("❌ DIMENSION MISMATCH");
    console.error("Expected:", EMBEDDING_DIMENSION);
    console.error("Received:", embedding.length);

    throw new Error(
      `Embedding dimension mismatch: expected ${EMBEDDING_DIMENSION}, received ${embedding.length}.`
    );
  }

  console.log("✅ Embedding OK");
  console.log("======================================");

  return embedding;
}
import { pipeline } from "@huggingface/transformers";
import { EMBEDDING_DIMENSION } from "@/lib/ai/rag-constants";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

type EmbeddingOutput = {
  data: Float32Array | number[];
};

type EmbeddingExtractor = (
  text: string,
  options: {
    pooling: "mean";
    normalize: boolean;
  }
) => Promise<EmbeddingOutput>;

let extractorPromise: Promise<EmbeddingExtractor> | null = null;

async function getExtractor(): Promise<EmbeddingExtractor> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL).then(
      (model) => model as unknown as EmbeddingExtractor
    );
  }

  return extractorPromise;
}

export async function createLocalEmbedding(text: string): Promise<number[]> {
  const normalizedText = text.trim();

  if (!normalizedText) {
    throw new Error("Cannot create embedding for empty text.");
  }

  const embeddingExtractor = await getExtractor();

  const output = await embeddingExtractor(normalizedText, {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(output.data);

  if (embedding.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Embedding dimension mismatch: expected ${EMBEDDING_DIMENSION}, received ${embedding.length}.`
    );
  }

  return embedding;
}

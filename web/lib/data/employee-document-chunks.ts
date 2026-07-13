import {
  RAG_MATCH_COUNT,
  RAG_SIMILARITY_THRESHOLD,
} from "@/lib/ai/rag-constants";
import { createServerSupabaseClient } from "@/services/supabase-server";

export type EmployeeDocumentChunk = {
  id: string;
  document_id: string;
  employee_id: string;
  user_id: string;
  content: string;
  chunk_index: number;
  embedding: number[] | null;
  created_at: string;
};

export type InsertEmployeeDocumentChunk = {
  documentId: string;
  employeeId: string;
  userId: string;
  content: string;
  chunkIndex: number;
  embedding: number[];
};

export type MatchedEmployeeDocumentChunk = {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  similarity: number;
};

type MatchEmployeeDocumentChunksRow = {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number | string;
  similarity: number | string;
};

export async function insertEmployeeDocumentChunks(
  chunks: InsertEmployeeDocumentChunk[]
): Promise<void> {
  if (chunks.length === 0) {
    return;
  }

  const supabase = await createServerSupabaseClient();

  const rows = chunks.map((chunk) => ({
    document_id: chunk.documentId,
    employee_id: chunk.employeeId,
    user_id: chunk.userId,
    content: chunk.content,
    chunk_index: chunk.chunkIndex,
    embedding: chunk.embedding,
  }));

  const { error } = await supabase.from("employee_document_chunks").insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteEmployeeDocumentChunks(
  documentId: string,
  employeeId: string,
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employee_document_chunks")
    .delete()
    .eq("document_id", documentId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function matchEmployeeDocumentChunks(
  queryEmbedding: number[],
  employeeId: string,
  userId: string,
  matchCount = RAG_MATCH_COUNT,
  similarityThreshold = RAG_SIMILARITY_THRESHOLD
): Promise<MatchedEmployeeDocumentChunk[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc("match_employee_document_chunks", {
    query_embedding: queryEmbedding,
    match_employee_id: employeeId,
    match_user_id: userId,
    match_count: matchCount,
    similarity_threshold: similarityThreshold,
  });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as MatchEmployeeDocumentChunksRow[];

  return rows.map((row) => ({
    id: String(row.id),
    document_id: String(row.document_id),
    content: String(row.content),
    chunk_index: Number(row.chunk_index),
    similarity: Number(row.similarity),
  }));
}

import type { EmployeeDocument } from "@/lib/types/employee-document";
import {
  DOCUMENT_PROCESSING_STATUS,
  EMPLOYEE_DOCUMENTS_BUCKET,
} from "@/lib/documents/constants";
import { deleteEmployeeDocumentChunks } from "@/lib/data/employee-document-chunks";
import { createServerSupabaseClient } from "@/services/supabase-server";

function mapEmployeeDocument(row: EmployeeDocument): EmployeeDocument {
  return {
    ...(row as EmployeeDocument),
    mime_type: row.mime_type ?? null,
    size: Number(row.size ?? 0),
    extracted_text: row.extracted_text ?? null,
    processing_status:
      row.processing_status ?? DOCUMENT_PROCESSING_STATUS.ready,
    processing_error: row.processing_error ?? null,
  };
}

/**
 * Storage layout:
 * employee-documents/{user_id}/{employee_id}/{document_id}/{sanitized_filename}
 */
export function buildDocumentStoragePath(
  userId: string,
  employeeId: string,
  documentId: string,
  filename: string
): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return `${userId}/${employeeId}/${documentId}/${sanitized}`;
}

export async function listEmployeeDocuments(
  employeeId: string,
  userId: string
): Promise<EmployeeDocument[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_documents")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapEmployeeDocument(row as EmployeeDocument));
}

export const getEmployeeDocuments = listEmployeeDocuments;

export async function getEmployeeDocumentFilenamesByIds(
  documentIds: string[],
  employeeId: string,
  userId: string
): Promise<Map<string, string>> {
  if (documentIds.length === 0) {
    return new Map();
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_documents")
    .select("id, filename")
    .in("id", documentIds)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const filenames = new Map<string, string>();

  for (const row of data ?? []) {
    filenames.set(String(row.id), String(row.filename));
  }

  return filenames;
}

export async function insertEmployeeDocument(
  document: Omit<EmployeeDocument, "created_at"> & {
    created_at?: string;
  }
): Promise<EmployeeDocument> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_documents")
    .insert({
      id: document.id,
      employee_id: document.employee_id,
      user_id: document.user_id,
      filename: document.filename,
      storage_path: document.storage_path,
      mime_type: document.mime_type,
      size: document.size,
      extracted_text: document.extracted_text ?? null,
      processing_status: document.processing_status,
      processing_error: document.processing_error ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save document metadata.");
  }

  return mapEmployeeDocument(data as EmployeeDocument);
}

export async function updateEmployeeDocument(
  documentId: string,
  employeeId: string,
  userId: string,
  updates: Partial<
    Pick<
      EmployeeDocument,
      | "extracted_text"
      | "processing_status"
      | "processing_error"
      | "storage_path"
      | "mime_type"
      | "size"
    >
  >
): Promise<EmployeeDocument> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_documents")
    .update(updates)
    .eq("id", documentId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update document metadata.");
  }

  return mapEmployeeDocument(data as EmployeeDocument);
}

export async function getEmployeeDocumentForUser(
  documentId: string,
  employeeId: string,
  userId: string
): Promise<EmployeeDocument | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_documents")
    .select("*")
    .eq("id", documentId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapEmployeeDocument(data as EmployeeDocument);
}

export async function deleteEmployeeDocumentRecord(
  documentId: string,
  employeeId: string,
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employee_documents")
    .delete()
    .eq("id", documentId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadDocumentToStorage(
  storagePath: string,
  buffer: Buffer,
  mimeType: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.storage
    .from(EMPLOYEE_DOCUMENTS_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteDocumentFromStorage(
  storagePath: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.storage
    .from(EMPLOYEE_DOCUMENTS_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function markEmployeeDocumentFailed(
  documentId: string,
  employeeId: string,
  userId: string,
  processingError: string
): Promise<void> {
  await updateEmployeeDocument(documentId, employeeId, userId, {
    processing_status: DOCUMENT_PROCESSING_STATUS.failed,
    processing_error: processingError,
  });
}

export async function cleanupUploadedDocumentArtifacts(options: {
  documentId: string;
  employeeId: string;
  userId: string;
  storagePath?: string;
}): Promise<void> {
  const failures: string[] = [];

  try {
    await deleteEmployeeDocumentChunks(
      options.documentId,
      options.employeeId,
      options.userId
    );
  } catch (error) {
    failures.push(
      error instanceof Error ? error.message : "chunk cleanup failed"
    );
  }

  try {
    await deleteEmployeeDocumentRecord(
      options.documentId,
      options.employeeId,
      options.userId
    );
  } catch (error) {
    failures.push(
      error instanceof Error ? error.message : "metadata cleanup failed"
    );
  }

  if (options.storagePath) {
    try {
      await deleteDocumentFromStorage(options.storagePath);
    } catch (error) {
      failures.push(
        error instanceof Error ? error.message : "storage cleanup failed"
      );
    }
  }

  if (failures.length > 0) {
    console.error("[documents] upload rollback encountered issues:", {
      documentId: options.documentId,
      employeeId: options.employeeId,
      failures,
    });
  }
}

export async function getKnowledgeFileCount(
  userId: string
): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from("employee_documents")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
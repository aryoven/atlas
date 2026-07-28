"use server";
import { getKnowledgeFileCount } from "@/lib/data/employee-documents";
import { getUserPlan } from "@/lib/subscription";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import type { EmployeeDocument } from "@/lib/types/employee-document";
import { getEmployeeForUser } from "@/lib/data/employees";
import {
  buildDocumentStoragePath,
  cleanupUploadedDocumentArtifacts,
  deleteDocumentFromStorage,
  deleteEmployeeDocumentRecord,
  getEmployeeDocumentForUser,
  insertEmployeeDocument,
  listEmployeeDocuments,
  markEmployeeDocumentFailed,
  updateEmployeeDocument,
  uploadDocumentToStorage,
} from "@/lib/data/employee-documents";
import {
  insertEmployeeDocumentChunks,
  deleteEmployeeDocumentChunks,
} from "@/lib/data/employee-document-chunks";
import {
  isAllowedDocumentType,
  extractDocumentText,
} from "@/lib/documents/extract-document-text";
import { chunkDocumentText } from "@/lib/documents/document-chunker";
import { createLocalEmbedding } from "@/lib/ai/local-embeddings";
import {
  DOCUMENT_PROCESSING_STATUS,
  MAX_DOCUMENT_SIZE_BYTES,
} from "@/lib/documents/constants";
import { createServerSupabaseClient } from "@/services/supabase-server";

const employeeIdSchema = z.string().uuid();
const documentIdSchema = z.string().uuid();

type ActionError = {
  error: string;
};

type DocumentsResult = {
  documents: EmployeeDocument[];
  uploadedDocumentId?: string;
};

async function getAuthenticatedContext(employeeId: string) {
  const parsedId = employeeIdSchema.safeParse(employeeId);

  if (!parsedId.success) {
    return {
      error: "Invalid employee ID.",
    } as ActionError;
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "You must be signed in.",
    } as ActionError;
  }

  const employee = await getEmployeeForUser(
    parsedId.data,
    user.id
  );

  if (!employee) {
    return {
      error: "AI Employee not found.",
    } as ActionError;
  }

  return {
    user,
    employee,
  };
}

async function fetchDocumentList(
  employeeId: string,
  userId: string
): Promise<EmployeeDocument[]> {
  return listEmployeeDocuments(employeeId, userId);
}

export async function listDocuments(
  employeeId: string
): Promise<DocumentsResult | ActionError> {
  const context = await getAuthenticatedContext(employeeId);

  if ("error" in context) {
    return context;
  }

  try {
    const documents = await fetchDocumentList(
      context.employee.id,
      context.user.id
    );

    return {
      documents,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to list documents.";

    return {
      error: message,
    };
  }
}

export async function uploadDocument(
  employeeId: string,
  formData: FormData
): Promise<DocumentsResult | ActionError> {
 const context = await getAuthenticatedContext(employeeId);

if ("error" in context) {
  return context;
}

// Check user's subscription plan
const plan = await getUserPlan(context.user.id);

// Count knowledge files across the entire account
const knowledgeFileCount = await getKnowledgeFileCount(
  context.user.id
);

// Enforce plan limit
if (
  Number.isFinite(plan.knowledgeLimit) &&
  knowledgeFileCount >= plan.knowledgeLimit
) {
  return {
    error: `You've reached your Knowledge File limit (${plan.knowledgeLimit}). Upgrade your plan to upload more files.`,
  };
}

const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      error: "No file provided.",
    };
  }

  if (file.size === 0) {
    return {
      error: "The selected file is empty.",
    };
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      error: "File exceeds the 20MB size limit.",
    };
  }

  const mimeType =
    file.type || "application/octet-stream";

  if (!isAllowedDocumentType(mimeType, file.name)) {
    return {
      error:
        "Unsupported file type. Upload PDF, DOCX, TXT, or MD files.",
    };
  }

  const documentId = randomUUID();

  const storagePath = buildDocumentStoragePath(
    context.user.id,
    context.employee.id,
    documentId,
    file.name
  );

  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  let extractedText: string;

  try {
    extractedText = await extractDocumentText(
      buffer,
      mimeType,
      file.name
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to read document contents.";

    return {
      error: message,
    };
  }

  const chunks = chunkDocumentText(extractedText);

  if (chunks.length === 0) {
    return {
      error: "No readable text was found in the document.",
    };
  }

  try {
    await insertEmployeeDocument({
      id: documentId,
      employee_id: context.employee.id,
      user_id: context.user.id,
      filename: file.name,
      storage_path: storagePath,
      mime_type: mimeType,
      size: file.size,
      extracted_text: null,
      processing_status: DOCUMENT_PROCESSING_STATUS.processing,
      processing_error: null,
    });

    const embeddedChunks = [];

    for (const chunk of chunks) {
      const embedding = await createLocalEmbedding(chunk.content);

      embeddedChunks.push({
        documentId,
        employeeId: context.employee.id,
        userId: context.user.id,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        embedding,
      });
    }

    await uploadDocumentToStorage(storagePath, buffer, mimeType);

    await updateEmployeeDocument(
      documentId,
      context.employee.id,
      context.user.id,
      {
        extracted_text: extractedText,
        processing_status: DOCUMENT_PROCESSING_STATUS.ready,
        processing_error: null,
      }
    );

    await insertEmployeeDocumentChunks(embeddedChunks);

    revalidatePath(
      `/dashboard/employees/${context.employee.id}`
    );

    revalidatePath(
      `/dashboard/employees/${context.employee.id}/manage`
    );

    const documents = await fetchDocumentList(
      context.employee.id,
      context.user.id
    );

    return {
      documents,
      uploadedDocumentId: documentId,
    };
  } catch (error) {
    const failureMessage =
      error instanceof Error ? error.message : "Failed to upload document.";

    await markEmployeeDocumentFailed(
      documentId,
      context.employee.id,
      context.user.id,
      normalizeDocumentError(failureMessage)
    ).catch(() => undefined);

    await cleanupUploadedDocumentArtifacts({
      documentId,
      employeeId: context.employee.id,
      userId: context.user.id,
      storagePath,
    });

    const message =
      error instanceof Error
        ? normalizeDocumentError(error.message)
        : "Failed to upload document.";

    return {
      error: message,
    };
  }
}

export async function deleteDocument(
  employeeId: string,
  documentId: string
): Promise<DocumentsResult | ActionError> {
  const context = await getAuthenticatedContext(employeeId);

  if ("error" in context) {
    return context;
  }

  const parsedDocumentId =
    documentIdSchema.safeParse(documentId);

  if (!parsedDocumentId.success) {
    return {
      error: "Invalid document ID.",
    };
  }

  const document = await getEmployeeDocumentForUser(
    parsedDocumentId.data,
    context.employee.id,
    context.user.id
  );

  if (!document) {
    return {
      error: "Document not found.",
    };
  }

  try {
    await deleteEmployeeDocumentChunks(
      document.id,
      context.employee.id,
      context.user.id
    );

    await deleteDocumentFromStorage(
      document.storage_path
    );

    await deleteEmployeeDocumentRecord(
      document.id,
      context.employee.id,
      context.user.id
    );

    revalidatePath(
      `/dashboard/employees/${context.employee.id}`
    );

    revalidatePath(
      `/dashboard/employees/${context.employee.id}/manage`
    );

    const documents = await fetchDocumentList(
      context.employee.id,
      context.user.id
    );

    return {
      documents,
    };
  } catch (error) {
    console.error("[documents] delete failed:", {
      documentId: document.id,
      employeeId: context.employee.id,
      error: error instanceof Error ? error.message : "unknown error",
    });

    const message =
      error instanceof Error
        ? normalizeDocumentError(error.message)
        : "Failed to delete document.";

    return {
      error: message,
    };
  }
}

function normalizeDocumentError(message: string): string {
  if (message.toLowerCase().includes("duplicate")) {
    return "A document with this name already exists. Rename the file and try again.";
  }

  if (message.toLowerCase().includes("payload too large")) {
    return "File exceeds the 20MB size limit.";
  }

  return message;
}

export async function loadEmployeeDocuments(
  employeeId: string
): Promise<EmployeeDocument[] | ActionError> {
  const result = await listDocuments(employeeId);

  if ("error" in result) {
    return result;
  }

  return result.documents;
}

export async function uploadEmployeeDocument(
  employeeId: string,
  formData: FormData
): Promise<
  { document: EmployeeDocument } | ActionError
> {
  const result = await uploadDocument(
    employeeId,
    formData
  );

  if ("error" in result) {
    return result;
  }

  const document = result.documents.find(
    (item) => item.id === result.uploadedDocumentId
  );

  if (!document || !result.uploadedDocumentId) {
    return {
      error:
        "Document uploaded but could not be retrieved.",
    };
  }

  return {
    document,
  };
}

export async function deleteEmployeeDocument(
  employeeId: string,
  documentId: string
): Promise<{ success: true } | ActionError> {
  const result = await deleteDocument(
    employeeId,
    documentId
  );

  if ("error" in result) {
    return result;
  }

  return {
    success: true,
  };
}
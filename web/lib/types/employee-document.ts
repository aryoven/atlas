import type { DocumentProcessingStatus } from "@/lib/documents/constants";

export type EmployeeDocument = {
  id: string;
  employee_id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  mime_type: string | null;
  size: number;
  extracted_text: string | null;
  processing_status: DocumentProcessingStatus;
  processing_error: string | null;
  created_at: string;
};

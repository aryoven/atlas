import type { ChatRole, ChatSource } from "@/lib/types/chat";

export type EmployeeMessage = {
  id: string;
  employee_id: string;
  user_id: string;
  conversation_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
  sources: ChatSource[] | null;
};

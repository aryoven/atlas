import type { ChatMessage, ChatMessageInput, ChatSource } from "@/lib/types/chat";
import { parseChatSources } from "@/lib/types/chat";
import type { EmployeeMessage } from "@/lib/types/employee-message";
import { MAX_CHAT_HISTORY_MESSAGES } from "@/lib/ai/chat-constants";
import { createServerSupabaseClient } from "@/services/supabase-server";

export function toChatMessage(message: EmployeeMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    created_at: message.created_at,
    sources: message.sources,
  };
}

export function toChatMessageInput(message: EmployeeMessage): ChatMessageInput {
  return {
    role: message.role,
    content: message.content,
  };
}

export function boundChatHistory(
  messages: ChatMessageInput[]
): ChatMessageInput[] {
  if (messages.length <= MAX_CHAT_HISTORY_MESSAGES) {
    return messages;
  }

  return messages.slice(-MAX_CHAT_HISTORY_MESSAGES);
}

export async function getEmployeeMessages(
  employeeId: string,
  userId: string,
  conversationId: string
): Promise<EmployeeMessage[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_messages")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    ...(row as EmployeeMessage),
    sources: parseChatSources((row as EmployeeMessage).sources),
  }));
}

export async function saveEmployeeMessage(
  employeeId: string,
  userId: string,
  conversationId: string,
  role: ChatMessage["role"],
  content: string,
  sources: ChatSource[] | null = null
): Promise<EmployeeMessage> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_messages")
    .insert({
      employee_id: employeeId,
      user_id: userId,
      conversation_id: conversationId,
      role,
      content,
      sources: role === "assistant" && sources && sources.length > 0 ? sources : null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save message.");
  }

  return {
    ...(data as EmployeeMessage),
    sources: parseChatSources((data as EmployeeMessage).sources),
  };
}

export async function getMessageCountsByEmployee(
  userId: string
): Promise<Record<string, number>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_messages")
    .select("employee_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  const counts: Record<string, number> = {};

  for (const row of data ?? []) {
    const employeeId = row.employee_id as string;
    counts[employeeId] = (counts[employeeId] ?? 0) + 1;
  }

  return counts;
}
export async function getMonthlyMessageCount(
  userId: string
): Promise<number> {
  const supabase = await createServerSupabaseClient();

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("employee_messages")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .eq("role", "user")
    .gte("created_at", startOfMonth.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
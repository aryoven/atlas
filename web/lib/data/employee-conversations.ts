import type { EmployeeConversation } from "@/lib/types/employee-conversation";
import { createServerSupabaseClient } from "@/services/supabase-server";

const DEFAULT_CONVERSATION_TITLE = "New conversation";
const MAX_TITLE_LENGTH = 48;

export function buildConversationTitle(firstUserMessage: string): string {
  const normalized = firstUserMessage.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return DEFAULT_CONVERSATION_TITLE;
  }

  if (normalized.length <= MAX_TITLE_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_TITLE_LENGTH - 3)}...`;
}

export async function listEmployeeConversations(
  employeeId: string,
  userId: string
): Promise<EmployeeConversation[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_conversations")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as EmployeeConversation[];
}

export async function getEmployeeConversationForUser(
  conversationId: string,
  employeeId: string,
  userId: string
): Promise<EmployeeConversation | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as EmployeeConversation;
}

export async function createEmployeeConversation(
  employeeId: string,
  userId: string,
  title = DEFAULT_CONVERSATION_TITLE
): Promise<EmployeeConversation> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_conversations")
    .insert({
      employee_id: employeeId,
      user_id: userId,
      title,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create conversation.");
  }

  return data as EmployeeConversation;
}

export async function touchEmployeeConversation(
  conversationId: string,
  employeeId: string,
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employee_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateEmployeeConversationTitle(
  conversationId: string,
  employeeId: string,
  userId: string,
  title: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employee_conversations")
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteEmployeeConversation(
  conversationId: string,
  employeeId: string,
  userId: string
): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employee_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("employee_id", employeeId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getConversationCountsByEmployee(
  userId: string
): Promise<Record<string, number>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("employee_conversations")
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

export async function getOrCreateActiveConversation(
  employeeId: string,
  userId: string,
  conversationId?: string | null
): Promise<EmployeeConversation> {
  if (conversationId) {
    const existing = await getEmployeeConversationForUser(
      conversationId,
      employeeId,
      userId
    );

    if (existing) {
      return existing;
    }
  }

  const conversations = await listEmployeeConversations(employeeId, userId);

  if (conversations.length > 0) {
    return conversations[0];
  }

  return createEmployeeConversation(employeeId, userId);
}

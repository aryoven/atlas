"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { EmployeeConversation } from "@/lib/types/employee-conversation";
import { getEmployeeForUser } from "@/lib/data/employees";
import {
  createEmployeeConversation,
  deleteEmployeeConversation,
  getEmployeeConversationForUser,
  listEmployeeConversations,
} from "@/lib/data/employee-conversations";
import { createServerSupabaseClient } from "@/services/supabase-server";

const employeeIdSchema = z.string().uuid();
const conversationIdSchema = z.string().uuid();

type ActionError = { error: string };

async function getAuthenticatedEmployee(employeeId: string) {
  const parsedId = employeeIdSchema.safeParse(employeeId);

  if (!parsedId.success) {
    return { error: "Invalid employee ID." } as ActionError;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." } as ActionError;
  }

  const employee = await getEmployeeForUser(parsedId.data, user.id);

  if (!employee) {
    return { error: "AI Employee not found." } as ActionError;
  }

  return { user, employee };
}

function revalidateEmployeePaths(employeeId: string) {
  revalidatePath(`/dashboard/employees/${employeeId}`);
  revalidatePath(`/dashboard/employees/${employeeId}/manage`);
}

export async function listConversations(
  employeeId: string
): Promise<{ conversations: EmployeeConversation[] } | ActionError> {
  const context = await getAuthenticatedEmployee(employeeId);

  if ("error" in context) {
    return context;
  }

  try {
    const conversations = await listEmployeeConversations(
      context.employee.id,
      context.user.id
    );

    return { conversations };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to load conversations.",
    };
  }
}

export async function createConversation(
  employeeId: string
): Promise<{ conversation: EmployeeConversation } | ActionError> {
  const context = await getAuthenticatedEmployee(employeeId);

  if ("error" in context) {
    return context;
  }

  try {
    const conversation = await createEmployeeConversation(
      context.employee.id,
      context.user.id
    );

    revalidateEmployeePaths(context.employee.id);

    return { conversation };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create conversation.",
    };
  }
}

export async function deleteConversation(
  employeeId: string,
  conversationId: string
): Promise<{ success: true } | ActionError> {
  const context = await getAuthenticatedEmployee(employeeId);

  if ("error" in context) {
    return context;
  }

  const parsedConversationId = conversationIdSchema.safeParse(conversationId);

  if (!parsedConversationId.success) {
    return { error: "Invalid conversation ID." };
  }

  const conversation = await getEmployeeConversationForUser(
    parsedConversationId.data,
    context.employee.id,
    context.user.id
  );

  if (!conversation) {
    return { error: "Conversation not found." };
  }

  try {
    await deleteEmployeeConversation(
      conversation.id,
      context.employee.id,
      context.user.id
    );

    revalidateEmployeePaths(context.employee.id);

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete conversation.",
    };
  }
}

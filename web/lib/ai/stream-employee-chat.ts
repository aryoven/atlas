import { getUserPlan } from "@/lib/subscription";
import { z } from "zod";
import type { ChatSource } from "@/lib/types/chat";
import type { EmployeeMessage } from "@/lib/types/employee-message";
import { MAX_CHAT_MESSAGE_LENGTH } from "@/lib/ai/chat-constants";
import {
  createEmployeeChatStream,
  getEmployeeChatContext,
} from "@/lib/ai/employee-chat-service";
import {
  buildConversationTitle,
  getEmployeeConversationForUser,
  touchEmployeeConversation,
  updateEmployeeConversationTitle,
} from "@/lib/data/employee-conversations";
import {
  boundChatHistory,
  getMonthlyMessageCount,
  getEmployeeMessages,
  saveEmployeeMessage,
  toChatMessageInput,
} from "@/lib/data/employee-messages";

const messageSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty.")
  .max(
    MAX_CHAT_MESSAGE_LENGTH,
    `Message must be at most ${MAX_CHAT_MESSAGE_LENGTH} characters.`
  );

export type StreamChatEvent =
  | { type: "userMessage"; message: EmployeeMessage }
  | { type: "token"; content: string }
  | {
      type: "done";
      assistantMessage: EmployeeMessage;
      sources: ChatSource[];
    }
  | { type: "error"; error: string };

export function normalizeChatError(message: string): string {
  if (message.includes("OPENROUTER_API_KEY")) {
    return "The AI service is not configured. Please contact support.";
  }

  if (message.toLowerCase().includes("rate limit")) {
    return "The AI service is temporarily busy. Please try again shortly.";
  }

  return "Failed to generate a response. Please try again.";
}

export async function* streamEmployeeChatTurn(
  employeeId: string,
  conversationId: string,
  userMessageContent: string
): AsyncGenerator<StreamChatEvent> {
  const parsedMessage = messageSchema.safeParse(userMessageContent);

  if (!parsedMessage.success) {
    yield {
      type: "error",
      error: parsedMessage.error.issues[0]?.message ?? "Invalid message.",
    };
    return;
  }

  const context = await getEmployeeChatContext(employeeId);

  if ("error" in context) {
    yield { type: "error", error: context.error };
    return;
  }

const plan = await getUserPlan(context.userId);

if (Number.isFinite(plan.monthlyMessageLimit)) {
  const monthlyMessages = await getMonthlyMessageCount(
    context.userId
  );

  if (monthlyMessages >= plan.monthlyMessageLimit) {
    yield {
      type: "error",
      error: `You've reached your monthly message limit (${plan.monthlyMessageLimit}). Upgrade your plan to continue chatting.`,
    };

    return;
  }
}

  const conversation = await getEmployeeConversationForUser(
    conversationId,
    employeeId,
    context.userId
  );

  if (!conversation) {
    yield { type: "error", error: "Conversation not found." };
    return;
  }

  try {
    const existingMessages = await getEmployeeMessages(
      employeeId,
      context.userId,
      conversationId
    );

    const isFirstUserMessage = !existingMessages.some(
      (message) => message.role === "user"
    );

    const userMessage = await saveEmployeeMessage(
      employeeId,
      context.userId,
      conversationId,
      "user",
      parsedMessage.data
    );

    yield { type: "userMessage", message: userMessage };

    const storedMessages = await getEmployeeMessages(
      employeeId,
      context.userId,
      conversationId
    );

    const history = boundChatHistory(
      storedMessages.map(toChatMessageInput)
    );

    let assistantContent = "";
    let sources: ChatSource[] = [];
    let hasStreamedToken = false;
    let attempt = 0;

    while (attempt < 2) {
      try {
        const chatStream = await createEmployeeChatStream(
          context.employee,
          context.userId,
          history
        );

        sources = chatStream.sources;

        for await (const chunk of chatStream.stream) {
          const delta = chunk.choices[0]?.delta?.content ?? "";

          if (delta) {
            hasStreamedToken = true;
            assistantContent += delta;

            yield {
              type: "token",
              content: delta,
            };
          }
        }

        break;
      } catch (error) {
        attempt += 1;

        console.error(
          `[chat] stream attempt ${attempt} failed before completion:`,
          error
        );

        if (hasStreamedToken || attempt >= 2) {
          throw error;
        }

        console.warn(
          "[chat] retrying stream once before first token..."
        );
      }
    }

    if (!assistantContent.trim()) {
      yield {
        type: "error",
        error: "No response received from the AI model.",
      };

      return;
    }

    const assistantMessage = await saveEmployeeMessage(
      employeeId,
      context.userId,
      conversationId,
      "assistant",
      assistantContent,
      sources
    );

    await touchEmployeeConversation(
      conversationId,
      employeeId,
      context.userId
    );

    if (isFirstUserMessage) {
      await updateEmployeeConversationTitle(
        conversationId,
        employeeId,
        context.userId,
        buildConversationTitle(parsedMessage.data)
      );
    }

    yield {
      type: "done",
      assistantMessage,
      sources,
    };
  } catch (error) {
    console.error("[chat] streaming turn failed:", error);

    yield {
      type: "error",
      error:
        error instanceof Error
          ? normalizeChatError(error.message)
          : "Failed to process message.",
    };
  }
}
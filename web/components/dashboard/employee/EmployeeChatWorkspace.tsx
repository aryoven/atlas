"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/lib/types/employee";
import type { ChatMessage } from "@/lib/types/chat";
import { parseChatSources } from "@/lib/types/chat";
import ChatMessageBubble from "@/components/chat/ChatMessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import Container from "@/components/ui/Container";

type EmployeeChatWorkspaceProps = {
  employee: Employee;
  conversationId: string;
  initialMessages: ChatMessage[];
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as ChatMessage;

  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    typeof message.created_at === "string"
  );
}

function normalizeChatMessage(value: unknown): ChatMessage | null {
  if (!isChatMessage(value)) {
    return null;
  }

  return {
    id: value.id,
    role: value.role,
    content: value.content,
    created_at: value.created_at,
    sources: parseChatSources(value.sources),
  };
}

function parseSseBlock(block: string): { event: string; data: unknown } | null {
  const lines = block.split("\n");
  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  try {
    return {
      event,
      data: JSON.parse(dataLines.join("\n")),
    };
  } catch {
    return null;
  }
}

export default function EmployeeChatWorkspace({
  employee,
  conversationId,
  initialMessages,
}: EmployeeChatWorkspaceProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (!shouldAutoScrollRef.current) {
      return;
    }

    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();

    if (!trimmed || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);
    setInput("");

    const optimisticAssistantId = `streaming-${crypto.randomUUID()}`;

    setMessages((current) => [
      ...current,
      {
        id: `optimistic-user-${crypto.randomUUID()}`,
        role: "user",
        content: trimmed,
        created_at: new Date().toISOString(),
      },
      {
        id: optimisticAssistantId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
        sources: null,
      },
    ]);
    setStreamingMessageId(optimisticAssistantId);

    try {
      const response = await fetch(`/api/employees/${employee.id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: trimmed,
          conversationId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to send message.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalUserMessage: ChatMessage | null = null;
      let finalAssistantMessage: ChatMessage | null = null;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const parsed = parseSseBlock(block);

          if (!parsed) {
            continue;
          }

          if (parsed.event === "token") {
            const content =
              typeof (parsed.data as { content?: unknown }).content === "string"
                ? (parsed.data as { content: string }).content
                : "";

            if (content) {
              setMessages((current) =>
                current.map((message) =>
                  message.id === optimisticAssistantId
                    ? { ...message, content: message.content + content }
                    : message
                )
              );
            }
          }

          if (parsed.event === "userMessage") {
            finalUserMessage = normalizeChatMessage(
              (parsed.data as { userMessage?: unknown }).userMessage
            );
          }

          if (parsed.event === "done") {
            const payload = parsed.data as {
              assistantMessage?: unknown;
              sources?: unknown;
            };

            const assistant = normalizeChatMessage(payload.assistantMessage);

            if (assistant) {
              finalAssistantMessage = {
                ...assistant,
                sources:
                  assistant.sources ?? parseChatSources(payload.sources),
              };
            }
          }

          if (parsed.event === "error") {
            const message =
              typeof (parsed.data as { error?: unknown }).error === "string"
                ? (parsed.data as { error: string }).error
                : "Failed to send message.";

            throw new Error(message);
          }
        }
      }

      if (!finalUserMessage || !finalAssistantMessage) {
        throw new Error("Invalid response received from chat API.");
      }

      setMessages((current) => {
        const withoutOptimistic = current.filter(
          (message) =>
            !message.id.startsWith("optimistic-") &&
            message.id !== optimisticAssistantId
        );

        return [...withoutOptimistic, finalUserMessage, finalAssistantMessage];
      });
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message.";

      setError(message);
      setInput(trimmed);
      setMessages((current) =>
        current.filter(
          (message) =>
            !message.id.startsWith("optimistic-") &&
            message.id !== optimisticAssistantId
        )
      );
    } finally {
      setStreamingMessageId(null);
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        onScroll={(event) => {
          const element = event.currentTarget;
          const distanceFromBottom =
            element.scrollHeight - element.scrollTop - element.clientHeight;

          shouldAutoScrollRef.current = distanceFromBottom < 120;
        }}
      >
        <Container className="max-w-3xl">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                  <span className="text-2xl font-bold text-primary">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-white">
                  Chat with {employee.name}
                </h2>

                <p className="mt-2 max-w-sm text-sm text-muted">
                  Ask questions about this AI Employee. Answers grounded in
                  uploaded company knowledge will include source citations.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                employeeName={employee.name}
                isStreaming={message.id === streamingMessageId}
              />
            ))}

            {error && (
              <p
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>
        </Container>
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        isLoading={isSending}
        placeholder={`Message ${employee.name}…`}
      />
    </div>
  );
}

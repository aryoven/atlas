"use client";

import { Cpu, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types/chat";
import { cn } from "@/lib/utils";
import AssistantMessageContent from "@/components/chat/AssistantMessageContent";
import ChatSources from "@/components/chat/ChatSources";
import TypingIndicator from "@/components/chat/TypingIndicator";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  employeeName: string;
  isStreaming?: boolean;
};

export default function ChatMessageBubble({
  message,
  employeeName,
  isStreaming = false,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const sources = message.sources ?? [];

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-white/10 text-white"
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Cpu className="h-4 w-4" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%]",
          isUser
            ? "bg-primary text-white"
            : "border border-white/10 bg-white/[0.04] text-foreground"
        )}
      >
        {!isUser && (
          <p className="mb-1 text-xs font-medium text-muted">{employeeName}</p>
        )}

        {message.content ? (
          isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-white align-middle" />
              )}
            </p>
          ) : (
            <>
              <AssistantMessageContent content={message.content} />
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
              )}
              {!isStreaming && sources.length > 0 && (
                <ChatSources sources={sources} />
              )}
            </>
          )
        ) : isStreaming ? (
          <TypingIndicator />
        ) : null}
      </div>
    </div>
  );
}

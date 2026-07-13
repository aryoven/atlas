"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import type { EmployeeConversation } from "@/lib/types/employee-conversation";
import {
  createConversation,
  deleteConversation,
} from "@/app/actions/conversations";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ConversationSidebarProps = {
  employeeId: string;
  conversations: EmployeeConversation[];
  activeConversationId: string;
};

export default function ConversationSidebar({
  employeeId,
  conversations,
  activeConversationId,
}: ConversationSidebarProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleNewChat = async () => {
    setError(null);
    const result = await createConversation(employeeId);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    router.push(
      `/dashboard/employees/${employeeId}?conversation=${result.conversation.id}`
    );
    router.refresh();
  };

  const handleDelete = async (
    event: React.MouseEvent,
    conversationId: string
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !window.confirm(
        "Delete this conversation and all of its messages? This cannot be undone."
      )
    ) {
      return;
    }

    const result = await deleteConversation(employeeId, conversationId);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (conversationId === activeConversationId) {
      router.push(`/dashboard/employees/${employeeId}`);
    }

    router.refresh();
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-background/40 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="border-b border-white/10 p-4">
        <Button
          type="button"
          size="sm"
          className="w-full"
          onClick={handleNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
          New Chat
        </Button>
        {error && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto lg:max-h-none lg:flex-1">
        {conversations.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">
            No conversations yet. Start a new chat to begin.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <li key={conversation.id}>
                  <Link
                    href={`/dashboard/employees/${employeeId}?conversation=${conversation.id}`}
                    className={cn(
                      "flex items-start gap-2 px-4 py-3 transition-colors hover:bg-white/[0.04]",
                      isActive && "bg-white/[0.06]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {conversation.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => handleDelete(event, conversation.id)}
                      className="shrink-0 rounded-md p-1 text-muted transition-colors hover:bg-white/10 hover:text-red-400"
                      aria-label={`Delete ${conversation.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

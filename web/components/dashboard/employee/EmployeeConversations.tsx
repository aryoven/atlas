import { MessageSquare, Plus } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import type { EmployeeConversation } from "@/lib/types/employee-conversation";
import Button from "@/components/ui/Button";

type EmployeeConversationsProps = {
  employee: Employee;
  conversations: EmployeeConversation[];
};

export default function EmployeeConversations({
  employee,
  conversations,
}: EmployeeConversationsProps) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <h2 className="mb-6 text-lg font-semibold text-white">Conversations</h2>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-background/20 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare
              className="h-7 w-7 text-primary"
              aria-hidden="true"
            />
          </div>
          <p className="max-w-sm text-sm text-muted">
            No conversations yet. Start chatting with this AI Employee to build
            conversation history.
          </p>
          <Button
            href={`/dashboard/employees/${employee.id}`}
            size="sm"
            className="mt-6"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Open Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
        <Button href={`/dashboard/employees/${employee.id}`} size="sm">
          Open Chat
        </Button>
      </div>

      <ul className="divide-y divide-white/5 rounded-xl border border-white/10">
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <a
              href={`/dashboard/employees/${employee.id}?conversation=${conversation.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/[0.04]"
            >
              <span className="truncate text-sm font-medium text-white">
                {conversation.title}
              </span>
              <time
                className="shrink-0 text-xs text-muted"
                dateTime={conversation.updated_at}
              >
                {new Date(conversation.updated_at).toLocaleDateString()}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

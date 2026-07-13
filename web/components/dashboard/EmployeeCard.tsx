import Link from "next/link";
import { Cpu, MessageSquare } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import { formatEmployeeDate } from "@/lib/utils/employee";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type EmployeeCardProps = {
  employee: Employee;
  conversationCount: number;
};

export default function EmployeeCard({
  employee,
  conversationCount,
}: EmployeeCardProps) {
  const createdDate = formatEmployeeDate(employee.created_at);

  return (
    <Card className="flex h-full flex-col hover:border-primary/30">
      <Link
        href={`/dashboard/employees/${employee.id}/manage`}
        className="block flex-1 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Cpu className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            Active
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
        <p className="mt-1 text-sm capitalize text-muted">{employee.role}</p>

        <div className="mt-5 space-y-2.5 rounded-xl border border-white/5 bg-background/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Model</span>
            <span className="font-medium text-white">{employee.model}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Conversations</span>
            <span className="font-medium text-white">{conversationCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Created</span>
            <span className="font-medium text-white">{createdDate}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4 border-t border-white/10 pt-4">
        <Button
          href={`/dashboard/employees/${employee.id}`}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Open Chat
        </Button>
      </div>
    </Card>
  );
}

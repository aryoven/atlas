import { Cpu, Thermometer, Calendar, MessageSquare } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import { formatEmployeeDateTime } from "@/lib/utils/employee";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type EmployeeDetailHeaderProps = {
  employee: Employee;
};

export default function EmployeeDetailHeader({
  employee,
}: EmployeeDetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Cpu className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {employee.name}
              </h1>
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                Active
              </Badge>
            </div>
            <p className="mt-1 text-base capitalize text-muted">
              {employee.role}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <Button
            href={`/dashboard/employees/${employee.id}`}
            size="sm"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Chat
          </Button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-xl border border-white/5 bg-background/40 px-4 py-3">
              <p className="text-xs text-muted">Model</p>
              <p className="mt-1 text-sm font-medium text-white">
                {employee.model}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-background/40 px-4 py-3">
              <p className="flex items-center gap-1 text-xs text-muted">
                <Thermometer className="h-3 w-3" aria-hidden="true" />
                Temperature
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {employee.temperature}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-background/40 px-4 py-3">
              <p className="flex items-center gap-1 text-xs text-muted">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                Created
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                {formatEmployeeDateTime(employee.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

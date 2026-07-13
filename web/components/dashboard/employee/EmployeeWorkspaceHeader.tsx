import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";

type EmployeeWorkspaceHeaderProps = {
  employee: Employee;
};

export default function EmployeeWorkspaceHeader({
  employee,
}: EmployeeWorkspaceHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                  {employee.name}
                </h1>
                <Badge className="hidden shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 sm:inline-flex">
                  Active
                </Badge>
              </div>
              <p className="truncate text-xs capitalize text-muted">
                {employee.role}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

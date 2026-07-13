"use client";

import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import type { Employee } from "@/lib/types/employee";
import Button from "@/components/ui/Button";

type EmployeeInstructionsProps = {
  employee: Employee;
};

export default function EmployeeInstructions({
  employee,
}: EmployeeInstructionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/employees/${employee.id}/manage?tab=settings`, {
      scroll: false,
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Instructions</h2>
        <Button variant="secondary" size="sm" onClick={handleEdit}>
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </Button>
      </div>
      <div className="rounded-xl border border-white/5 bg-background/40 p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {employee.instructions}
        </p>
      </div>
    </div>
  );
}

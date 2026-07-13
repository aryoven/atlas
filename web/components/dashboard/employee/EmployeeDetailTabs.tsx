"use client";

import { Suspense } from "react";
import type { Employee } from "@/lib/types/employee";
import type { EmployeeDocument } from "@/lib/types/employee-document";
import type { EmployeeConversation } from "@/lib/types/employee-conversation";
import EmployeeTabs, { useEmployeeTab } from "@/components/dashboard/employee/EmployeeTabs";
import EmployeeOverview from "@/components/dashboard/employee/EmployeeOverview";
import EmployeeInstructions from "@/components/dashboard/employee/EmployeeInstructions";
import EmployeeKnowledgeBase from "@/components/dashboard/employee/EmployeeKnowledgeBase";
import EmployeeConversations from "@/components/dashboard/employee/EmployeeConversations";
import EmployeeSettingsForm from "@/components/dashboard/employee/EmployeeSettingsForm";

type EmployeeDetailTabsProps = {
  employee: Employee;
  initialDocuments: EmployeeDocument[];
  initialConversations: EmployeeConversation[];
  basePath?: string;
};

function EmployeeTabContent({
  employee,
  initialDocuments,
  initialConversations,
}: Omit<EmployeeDetailTabsProps, "basePath">) {
  const activeTab = useEmployeeTab();

  switch (activeTab) {
    case "instructions":
      return <EmployeeInstructions employee={employee} />;
    case "knowledge":
      return (
        <EmployeeKnowledgeBase
          key={initialDocuments.map((document) => document.id).join("-")}
          employee={employee}
          initialDocuments={initialDocuments}
        />
      );
    case "conversations":
      return (
        <EmployeeConversations
          employee={employee}
          conversations={initialConversations}
        />
      );
    case "settings":
      return <EmployeeSettingsForm employee={employee} />;
    case "overview":
    default:
      return <EmployeeOverview employee={employee} />;
  }
}

export default function EmployeeDetailTabs({
  employee,
  initialDocuments,
  initialConversations,
  basePath,
}: EmployeeDetailTabsProps) {
  const resolvedBasePath =
    basePath ?? `/dashboard/employees/${employee.id}/manage`;

  return (
    <>
      <Suspense
        fallback={
          <div className="border-b border-white/10 pb-3">
            <div className="h-10 animate-pulse rounded-lg bg-white/5" />
          </div>
        }
      >
        <EmployeeTabs employeeId={employee.id} basePath={resolvedBasePath} />
      </Suspense>

      <div className="mt-8">
        <Suspense
          fallback={
            <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
          }
        >
          <EmployeeTabContent
            employee={employee}
            initialDocuments={initialDocuments}
            initialConversations={initialConversations}
          />
        </Suspense>
      </div>
    </>
  );
}

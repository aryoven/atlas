"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmployeeTab } from "@/lib/types/employee";
import { EMPLOYEE_TABS } from "@/lib/types/employee";
import { cn } from "@/lib/utils";

const VALID_TABS = new Set<string>(EMPLOYEE_TABS.map((tab) => tab.id));

function isValidTab(tab: string | null): tab is EmployeeTab {
  return tab !== null && VALID_TABS.has(tab);
}

export default function EmployeeTabs({
  employeeId,
  basePath,
}: {
  employeeId: string;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: EmployeeTab = isValidTab(rawTab) ? rawTab : "overview";
  const resolvedBasePath =
    basePath ?? `/dashboard/employees/${employeeId}/manage`;

  const setTab = useCallback(
    (tab: EmployeeTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      const query = params.toString();
      router.push(
        `${resolvedBasePath}${query ? `?${query}` : ""}`,
        { scroll: false }
      );
    },
    [resolvedBasePath, router, searchParams]
  );

  return (
    <div className="border-b border-white/10">
      <nav
        className="-mb-px flex gap-1 overflow-x-auto"
        aria-label="Employee sections"
      >
        {EMPLOYEE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-primary text-white"
                : "border-transparent text-muted hover:border-white/20 hover:text-white"
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function useEmployeeTab(): EmployeeTab {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  return isValidTab(rawTab) ? rawTab : "overview";
}

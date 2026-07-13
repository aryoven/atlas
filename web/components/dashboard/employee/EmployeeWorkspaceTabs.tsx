"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";

type EmployeeWorkspaceTabsProps = {
  employeeId: string;
};

export default function EmployeeWorkspaceTabs({
  employeeId,
}: EmployeeWorkspaceTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const tabs = [
    {
      id: "chat",
      label: "Chat",
      href: `/dashboard/employees/${employeeId}`,
    },
    {
      id: "knowledge",
      label: "Knowledge",
      href: `/dashboard/employees/${employeeId}/manage?tab=knowledge`,
    },
    {
      id: "settings",
      label: "Settings",
      href: `/dashboard/employees/${employeeId}/manage?tab=settings`,
    },
  ];

  const isChatPage = pathname === `/dashboard/employees/${employeeId}`;

  const isManagePage =
    pathname === `/dashboard/employees/${employeeId}/manage`;

  const isActive = (id: string) => {
    if (id === "chat") {
      return isChatPage;
    }

    if (id === "knowledge") {
      return isManagePage && tab === "knowledge";
    }

    if (id === "settings") {
      return isManagePage && tab === "settings";
    }

    return false;
  };

  return (
    <div className="border-b border-white/10">
      <Container>
        <nav
          className="-mb-px flex gap-1 overflow-x-auto"
          aria-label="Employee workspace"
        >
          {tabs.map((tabItem) => {
            const active = isActive(tabItem.id);

            return (
              <Link
                key={tabItem.id}
                href={tabItem.href}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-white"
                    : "border-transparent text-muted hover:border-white/20 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                {tabItem.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}

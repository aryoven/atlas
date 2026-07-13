import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/services/supabase-server";
import { getEmployeeForUser } from "@/lib/data/employees";
import { getEmployeeDocuments } from "@/lib/data/employee-documents";
import { listEmployeeConversations } from "@/lib/data/employee-conversations";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmployeeWorkspaceHeader from "@/components/dashboard/employee/EmployeeWorkspaceHeader";
import EmployeeWorkspaceTabs from "@/components/dashboard/employee/EmployeeWorkspaceTabs";
import EmployeeDetailHeader from "@/components/dashboard/employee/EmployeeDetailHeader";
import EmployeeDetailTabs from "@/components/dashboard/employee/EmployeeDetailTabs";
import Container from "@/components/ui/Container";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { title: "Employee — Atlas AI" };
  }

  const employee = await getEmployeeForUser(id, user.id);

  return {
    title: employee
      ? `Manage ${employee.name} — Atlas AI`
      : "Employee — Atlas AI",
    description: employee
      ? `Manage ${employee.name}, your AI ${employee.role}`
      : "AI Employee details",
  };
}

export default async function EmployeeManagePage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const employee = await getEmployeeForUser(id, user.id);

  if (!employee) {
    notFound();
  }

  let initialDocuments: Awaited<ReturnType<typeof getEmployeeDocuments>> = [];
  let initialConversations: Awaited<
    ReturnType<typeof listEmployeeConversations>
  > = [];

  try {
    initialDocuments = await getEmployeeDocuments(employee.id, user.id);
  } catch (documentsError) {
    console.error(documentsError);
  }

  try {
    initialConversations = await listEmployeeConversations(
      employee.id,
      user.id
    );
  } catch (conversationsError) {
    console.error(conversationsError);
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <EmployeeWorkspaceHeader employee={employee} />
      <Suspense
        fallback={
          <div className="border-b border-white/10 pb-3">
            <div className="h-10 animate-pulse rounded-lg bg-white/5" />
          </div>
        }
      >
        <EmployeeWorkspaceTabs employeeId={employee.id} />
      </Suspense>

      <main className="py-10">
        <Container>
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="space-y-8">
            <EmployeeDetailHeader employee={employee} />

            <Suspense
              fallback={
                <div className="space-y-8">
                  <div className="h-10 animate-pulse rounded-lg bg-white/5" />
                  <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
                </div>
              }
            >
              <EmployeeDetailTabs
                employee={employee}
                initialDocuments={initialDocuments}
                initialConversations={initialConversations}
                basePath={`/dashboard/employees/${employee.id}/manage`}
              />
            </Suspense>
          </div>
        </Container>
      </main>
    </div>
  );
}

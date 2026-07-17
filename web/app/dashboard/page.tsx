import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bot, BarChart3, Users, Plus } from "lucide-react";
import { createServerSupabaseClient } from "@/services/supabase-server";
import type { Employee } from "@/lib/types/employee";
import { getConversationCountsByEmployee } from "@/lib/data/employee-conversations";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmployeeCard from "@/components/dashboard/EmployeeCard";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dashboard — Atlas AI",
  description: "Manage your AI workforce",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "User";

  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  const employeeList = (employees ?? []) as Employee[];
  const employeeCount = employeeList.length;

  let conversationCounts: Record<string, number> = {};

  try {
    conversationCounts = await getConversationCountsByEmployee(user.id);
  } catch (countsError) {
    console.error(countsError);
  }

  const totalConversations = Object.values(conversationCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const stats = [
    {
      label: "AI Employees",
      value: employeeCount.toString(),
      icon: Bot,
    },
    {
      label: "Active Conversations",
      value: totalConversations.toString(),
      icon: Users,
    },
    {
      label: "Revenue This Month",
      value: "$0",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        actions={
          <Button href="/dashboard/employees/new" size="sm">
            + Create AI Employee
          </Button>
        }
      />

      <main className="py-10">
        <Container>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome back, {fullName}
            </h1>
            <p className="mt-2 text-muted">
              Manage your AI workforce and track performance from your dashboard.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {employeeCount === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Deploy your first AI Employee
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Get started by creating your first AI Employee. You can build
                Sales, Support, Voice, or custom AI workers for your business.
              </p>
              <div className="mt-6">
                <Button href="/onboarding" size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create AI Employee
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Your AI Employees
                </h2>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                  {employeeCount} Active
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {employeeList.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    conversationCount={conversationCounts[employee.id] ?? 0}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

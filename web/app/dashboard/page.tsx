import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bot, BarChart3, Users } from "lucide-react";
import { createServerSupabaseClient } from "@/services/supabase-server";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";
import DashboardSignOut from "@/components/dashboard/DashboardSignOut";

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

  const stats = [
    { label: "AI Employees", value: "0", icon: Bot },
    { label: "Active Conversations", value: "0", icon: Users },
    { label: "Revenue This Month", value: "$0", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <DashboardSignOut />
          </div>
        </Container>
      </header>

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
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-7 w-7 text-primary" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Deploy your first AI Employee
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Get started by configuring a Sales Employee, Support Agent, or
              Voice Agent to begin automating your business operations.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}

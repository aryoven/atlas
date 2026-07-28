import UpgradeButton from "@/components/billing/UpgradeButton";
import ManageSubscriptionButton from "@/components/billing/ManageSubscriptionButton";
import ProgressBar from "@/components/ui/ProgressBar";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bot, FileText, MessageSquare, Crown } from "lucide-react";

import { createServerSupabaseClient } from "@/services/supabase-server";
import { getUserPlan } from "@/lib/subscription";
import { getMonthlyMessageCount } from "@/lib/data/employee-messages";
import { getKnowledgeFileCount } from "@/lib/data/employee-documents";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Billing — Atlas AI",
};

function formatLimit(limit: number) {
  return Number.isFinite(limit) ? limit.toString() : "Unlimited";
}

function getUsagePercentage(used: number, limit: number) {
  if (!Number.isFinite(limit) || limit <= 0) {
    return 0;
  }

  return (used / limit) * 100;
}

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const plan = await getUserPlan(user.id);

  const [{ count: employeeCount }, knowledgeFiles, monthlyMessages] =
    await Promise.all([
      supabase
        .from("employees")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id),

      getKnowledgeFileCount(user.id),

      getMonthlyMessageCount(user.id),
    ]);

  const usage = [
    {
      icon: Bot,
      label: "AI Employees",
      used: employeeCount ?? 0,
      limit: plan.employeeLimit,
    },
    {
      icon: FileText,
      label: "Knowledge Files",
      used: knowledgeFiles,
      limit: plan.knowledgeLimit,
    },
    {
      icon: MessageSquare,
      label: "Messages This Month",
      used: monthlyMessages,
      limit: plan.monthlyMessageLimit,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="py-10">
        <Container>
          <h1 className="text-3xl font-bold text-white">
            Billing
          </h1>

          <p className="mt-2 text-muted">
            Manage your subscription and monitor your current usage.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-primary" />

                <span className="text-sm uppercase tracking-widest text-primary">
                  Current Plan
                </span>
              </div>

              <h2 className="mt-4 text-4xl font-bold text-white">
                {plan.name}
              </h2>

              <p className="mt-3 text-sm text-muted">
                Upgrade anytime to unlock more AI Employees,
                Knowledge Files, Messages and premium features.
              </p>

              <div className="mt-6">
                {plan.id === "free" ? (
                  <UpgradeButton />
                ) : (
                  <ManageSubscriptionButton />
                )}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-xl font-semibold text-white">
                Usage
              </h2>

              <div className="mt-6 space-y-6">
                {usage.map((item) => (
                  <div
                    key={item.label}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>

                        <span className="text-white">
                          {item.label}
                        </span>
                      </div>

                      <span className="font-medium text-muted">
                        {item.used} / {formatLimit(item.limit)}
                      </span>
                    </div>

                    {Number.isFinite(item.limit) && (
                      <ProgressBar
                        value={getUsagePercentage(
                          item.used,
                          item.limit
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
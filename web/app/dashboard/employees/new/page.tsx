import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/services/supabase-server";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreateEmployeeForm from "@/components/dashboard/CreateEmployeeForm";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Create AI Employee — Atlas AI",
  description: "Configure and deploy a new AI Employee",
};

export default async function NewEmployeePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="py-10">
        <Container className="max-w-2xl">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Create AI Employee
              </h1>
              <p className="mt-2 text-sm text-muted">
                Configure your AI worker&apos;s personality, model, and behavior.
              </p>
            </div>

            <CreateEmployeeForm />
          </div>
        </Container>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/services/supabase-server";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Get Started — Aryoven",
  description: "Create your first AI Employee in under a minute",
};

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/onboarding");
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <header className="relative border-b border-white/10">
        <Container className="flex h-16 items-center">
          <Logo />
        </Container>
      </header>

      <main className="relative flex flex-1 items-center py-12 sm:py-16">
        <Container>
          <OnboardingWizard />
        </Container>
      </main>
    </div>
  );
}

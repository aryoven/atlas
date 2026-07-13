import { ArrowLeft } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function EmployeeNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="py-10">
        <Container className="max-w-lg text-center">
          <h1 className="text-2xl font-bold text-white">Employee not found</h1>
          <p className="mt-2 text-sm text-muted">
            This AI Employee doesn&apos;t exist or you don&apos;t have access to
            it.
          </p>
          <div className="mt-8">
            <Button href="/dashboard" size="sm">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}

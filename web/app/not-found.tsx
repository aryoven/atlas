import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>

        <h2 className="mt-6 text-4xl font-bold text-white">
          Page not found
        </h2>

        <p className="mt-6 text-lg text-muted">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button href="/">
            Back Home
          </Button>

          <Link
            href="/pricing"
            className="rounded-xl border border-white/10 px-6 py-3 text-white transition hover:border-primary"
          >
            Pricing
          </Link>
        </div>
      </div>
    </main>
  );
}
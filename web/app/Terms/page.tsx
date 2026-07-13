import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Atlas AI",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-white">
        Terms of Service
      </h1>

      <p className="mt-6 text-muted">
        These Terms of Service will be updated before public launch.
      </p>
    </main>
  );
}
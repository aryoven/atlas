import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Atlas AI",
  description: "Learn more about Atlas AI.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-white">About Atlas AI</h1>

      <p className="mt-6 text-muted">
        Atlas AI helps businesses build AI Employees for sales, support,
        operations and customer service.
      </p>
    </main>
  );
}
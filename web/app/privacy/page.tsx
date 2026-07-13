import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Atlas AI",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-white">
        Privacy Policy
      </h1>

      <p className="mt-6 text-muted">
        This Privacy Policy will be updated before public launch.
      </p>
    </main>
  );
}
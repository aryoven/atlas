import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Atlas AI",
  description: "Contact Atlas AI.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-white">
        Contact Us
      </h1>

      <p className="mt-4 text-muted">
        We'd love to hear from you.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-xl font-semibold text-white">
          Contact Information
        </h2>

        <div className="mt-6 space-y-4 text-muted">
          <p>
            <span className="font-medium text-white">Email:</span>
            <br />
            rezarst19@gmail.com
          </p>

          <p>We usually reply within 24 hours.</p>
        </div>
      </div>
    </main>
  );
}
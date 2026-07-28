import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Atlas AI",
  description:
    "Learn how Atlas AI collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold text-white">
        Privacy Policy
      </h1>

      <p className="mt-4 text-muted">
        Last updated: July 2026
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8">

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            Atlas AI collects information that you provide directly, including
            your account details, AI Employees, uploaded knowledge files,
            conversations, and billing information.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to provide AI services, manage your account,
            improve the platform, process payments, and respond to support
            requests.
          </p>
        </section>

        <section>
          <h2>3. AI Processing</h2>
          <p>
            Messages and uploaded knowledge files may be securely processed by
            third-party AI providers to generate responses. We do not sell your
            personal data.
          </p>
        </section>

        <section>
          <h2>4. Payments</h2>
          <p>
            Payments are securely processed through Stripe. Atlas AI never
            stores your full payment card information.
          </p>
        </section>

        <section>
          <h2>5. Data Storage</h2>
          <p>
            Your account information, conversations, and uploaded files are
            securely stored using Supabase infrastructure.
          </p>
        </section>

        <section>
          <h2>6. Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect
            your information. However, no online service can guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            account data by contacting us.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            For privacy-related questions, please contact us at:
            <br />
            support@atlas-ai.app
          </p>
        </section>

      </div>
    </main>
  );
}
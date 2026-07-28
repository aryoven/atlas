import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Atlas AI",
  description:
    "Read the Terms of Service for using Atlas AI.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-bold text-white">
        Terms of Service
      </h1>

      <p className="mt-4 text-muted">
        Last updated: July 2026
      </p>

      <div className="prose prose-invert mt-10 max-w-none space-y-8">

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Atlas AI, you agree to these Terms of
            Service. If you do not agree with these terms, you may not use
            the service.
          </p>
        </section>

        <section>
          <h2>2. Accounts</h2>
          <p>
            You are responsible for maintaining the security of your account
            and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2>3. Acceptable Use</h2>
          <p>
            You agree not to misuse the service, attempt unauthorized access,
            upload malicious content, interfere with the platform, or use
            Atlas AI for illegal activities.
          </p>
        </section>

        <section>
          <h2>4. AI Responses</h2>
          <p>
            AI-generated responses may contain inaccuracies. You are
            responsible for reviewing and verifying any output before relying
            on it for business or personal decisions.
          </p>
        </section>

        <section>
          <h2>5. Subscription & Billing</h2>
          <p>
            Paid subscriptions are billed through Stripe. Subscription fees
            are charged according to your selected plan and renew
            automatically unless canceled before the next billing period.
          </p>
        </section>

        <section>
          <h2>6. Cancellation</h2>
          <p>
            You may cancel your subscription at any time through the Billing
            page. Your subscription will remain active until the end of the
            current billing period.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            Atlas AI and its software, branding, and content are protected by
            applicable intellectual property laws. You retain ownership of the
            data and files you upload.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            Atlas AI is provided on an "as is" basis without warranties of any
            kind. To the maximum extent permitted by law, Atlas AI shall not
            be liable for indirect, incidental, or consequential damages
            arising from the use of the service.
          </p>
        </section>

        <section>
          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued
            use of Atlas AI after changes become effective constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            For questions regarding these Terms of Service, please contact:
            <br />
            support@atlas-ai.app
          </p>
        </section>

      </div>
    </main>
  );
}
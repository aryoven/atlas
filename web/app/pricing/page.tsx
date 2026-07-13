import type { Metadata } from "next";
import PricingSection from "@/components/pricing/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Atlas AI",
  description: "Atlas AI Pricing",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <PricingSection />
    </main>
  );
}
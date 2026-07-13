"use client";

import PricingCard from "./PricingCard";

const plans = [
  {
    title: "Starter",
    price: "$299",
    description:
      "Perfect for startups beginning their AI automation journey.",
    buttonText: "Start Free Trial",
    features: [
      "2 AI Employees",
      "500 voice minutes/month",
      "CRM integration",
      "Email support",
      "Knowledge Base",
    ],
  },
  {
    title: "Growth",
    price: "$799",
    description:
      "Scale your business with a complete AI workforce.",
    buttonText: "Start Free Trial",
    popular: true,
    features: [
      "8 AI Employees",
      "2,000 voice minutes/month",
      "Advanced CRM sync",
      "Priority support",
      "Custom workflows",
      "API access",
      "Analytics Dashboard",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    description:
      "Tailored AI solutions for large organizations.",
    buttonText: "Contact Sales",
    features: [
      "Unlimited AI Employees",
      "Unlimited voice minutes",
      "Dedicated Success Manager",
      "SSO",
      "Custom AI Training",
      "On-premise deployment",
      "SLA guarantees",
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">
          <span className="text-primary font-semibold uppercase tracking-widest">
            Pricing
          </span>

          <h2 className="mt-4 text-5xl font-bold text-white">
            Choose the perfect AI Workforce
          </h2>

          <p className="mt-6 text-lg text-muted">
            Transparent pricing that scales with your business.
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
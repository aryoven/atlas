"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$299",
    period: "/month",
    description: "Perfect for small teams getting started with AI Employees.",
    features: [
      "2 AI Employees",
      "500 voice minutes/month",
      "CRM integration",
      "Email & chat support",
      "Basic analytics",
      "Knowledge base (50 docs)",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Growth",
    price: "$799",
    period: "/month",
    description: "For growing businesses scaling their AI workforce.",
    features: [
      "8 AI Employees",
      "2,000 voice minutes/month",
      "Advanced CRM sync",
      "Priority support",
      "Custom workflows",
      "A/B testing",
      "Team collaboration",
      "API access",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations with complex needs.",
    features: [
      "Unlimited AI Employees",
      "Unlimited voice minutes",
      "Dedicated success manager",
      "Custom AI training",
      "SSO & advanced security",
      "SLA guarantees",
      "On-premise deployment",
      "White-label options",
    ],
    cta: "Contact Sales",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionTitle
          badge="Pricing"
          title="Simple, transparent pricing"
          description="Start with a 14-day free trial. No setup fees. Cancel anytime."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={cn(plan.highlighted && "lg:-mt-4 lg:mb-4")}
            >
              <Card
                hover={false}
                className={cn(
                  "relative flex h-full flex-col",
                  plan.highlighted &&
                    "border-primary/40 bg-primary/[0.06] ring-1 ring-primary/20"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted">{plan.description}</p>
                </div>

                <ul className="my-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="#contact"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

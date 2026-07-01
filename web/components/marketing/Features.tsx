"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Filter,
  Phone,
  Link2,
  BarChart3,
  Zap,
  LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Your AI Employees never sleep. Handle inquiries, calls, and leads around the clock without overtime costs.",
  },
  {
    icon: Filter,
    title: "Lead Qualification",
    description:
      "Automatically score and qualify inbound leads using custom criteria, routing hot prospects to your team instantly.",
  },
  {
    icon: Phone,
    title: "Voice Calls",
    description:
      "Natural-sounding AI voice agents that make outbound calls, handle inbound, and follow up with prospects.",
  },
  {
    icon: Link2,
    title: "CRM Integration",
    description:
      "Seamlessly sync with HubSpot, Salesforce, and 50+ tools. Every interaction logged automatically.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Real-time dashboards tracking conversion rates, call volumes, response times, and revenue attribution.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Build multi-step workflows that trigger emails, schedule appointments, and update records without manual work.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="Features"
          title="Everything you need to scale with AI"
          description="Powerful capabilities built into every AI Employee, designed to drive revenue and reduce operational overhead."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="h-full">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

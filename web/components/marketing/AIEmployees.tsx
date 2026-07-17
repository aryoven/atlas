"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Headphones,
  PenLine,
  Megaphone,
  Calculator,
  Code2,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

type Employee = {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
};

const employees: Employee[] = [
  {
    icon: TrendingUp,
    title: "Sales",
    description: "Qualify leads, answer product questions, and follow up on prospects.",
    benefits: ["Lead responses", "Pricing answers", "Follow-ups"],
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Resolve customer questions instantly using your company knowledge.",
    benefits: ["Policy answers", "Ticket help", "24/7 availability"],
  },
  {
    icon: PenLine,
    title: "Editor",
    description: "Draft content, refine copy, and maintain your brand voice.",
    benefits: ["Content drafts", "Proofreading", "Tone matching"],
  },
  {
    icon: Megaphone,
    title: "Marketing",
    description: "Create campaigns, social posts, and messaging from your docs.",
    benefits: ["Ad copy", "Social posts", "Email drafts"],
  },
  {
    icon: Calculator,
    title: "Accountant",
    description: "Answer billing, invoicing, and financial policy questions.",
    benefits: ["Policy lookup", "FAQ answers", "Client support"],
  },
  {
    icon: Code2,
    title: "Custom",
    description: "Build any role you need with custom instructions and knowledge.",
    benefits: ["Any role", "Your rules", "Your data"],
  },
];

export default function AIEmployees() {
  return (
    <section id="solutions" className="relative py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionTitle
          badge="AI Employees"
          title="Build the team you need"
          description="Pre-built roles or fully custom. Each employee learns from your knowledge."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee, i) => (
            <motion.div
              key={employee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="flex h-full flex-col">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <employee.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white">{employee.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {employee.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {employee.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-xs text-muted"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  href="/signup"
                  variant="ghost"
                  size="sm"
                  className="mt-5 w-fit px-0 hover:bg-transparent"
                >
                  Start Free
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

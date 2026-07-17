"use client";

import { motion } from "framer-motion";
import {
  Bot,
  FileText,
  MessageSquare,
  Settings,
  Shield,
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
    icon: Bot,
    title: "Custom AI Employees",
    description:
      "Create specialized workers for sales, support, marketing, or any role you define.",
  },
  {
    icon: FileText,
    title: "Knowledge Base",
    description:
      "Upload documents. Your AI Employees answer from your data — with source citations.",
  },
  {
    icon: MessageSquare,
    title: "Persistent Chat",
    description:
      "Every conversation is saved. Pick up where you left off, anytime.",
  },
  {
    icon: Settings,
    title: "Full Control",
    description:
      "Set instructions, choose models, and tune behavior per employee.",
  },
  {
    icon: Shield,
    title: "Your Data, Isolated",
    description:
      "Each account is private. Your knowledge and conversations stay yours.",
  },
  {
    icon: Zap,
    title: "Deploy in Minutes",
    description:
      "No code required. Create an employee, upload files, and start chatting.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="Features"
          title="Everything to run your AI team"
          description="One platform to create, train, and manage AI Employees."
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

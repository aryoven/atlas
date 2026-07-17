"use client";

import { motion } from "framer-motion";
import { UserPlus, FileUp, MessageSquare, LineChart } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create an AI Employee",
    description:
      "Pick a role or build a custom one. Set name, instructions, and model.",
  },
  {
    step: "02",
    icon: FileUp,
    title: "Upload Knowledge",
    description:
      "Add PDFs, docs, or text files. Your employee learns your business.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Start Chatting",
    description:
      "Ask questions. Get answers grounded in your data with source citations.",
  },
  {
    step: "04",
    icon: LineChart,
    title: "Scale Your Team",
    description:
      "Add more employees as you grow. Each one specialized for its role.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="How It Works"
          title="Live in four steps"
          description="No engineering team. No complex setup."
        />

        <div className="relative mt-16">
          <div
            className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-primary via-primary/50 to-transparent lg:left-1/2 lg:block lg:-translate-x-px"
            aria-hidden="true"
          />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                } ${i > 0 ? "lg:mt-16" : ""}`}
              >
                <div className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:z-10 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">
                    {step.step}
                  </div>
                </div>

                <div className={`lg:w-1/2 ${i % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                  <div className="mb-3 flex items-center gap-3 lg:hidden">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {step.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>

                <div className={`hidden lg:block lg:w-1/2 ${i % 2 === 0 ? "lg:pl-16" : "lg:pr-16"}`}>
                  <div className="flex h-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <step.icon className="h-10 w-10 text-primary/60" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

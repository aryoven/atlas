"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is an AI Employee?",
    answer:
      "An AI Employee is an autonomous agent trained to perform specific business roles — like sales, support, or reception — using natural language, voice, and automation. They integrate with your existing tools and work 24/7 without breaks.",
  },
  {
    question: "How quickly can I deploy an AI Employee?",
    answer:
      "Most customers deploy their first AI Employee within an hour. Choose a role template, connect your CRM and calendar, upload your knowledge base, and go live. No engineering team required.",
  },
  {
    question: "Does Atlas AI integrate with my CRM?",
    answer:
      "Yes. Atlas AI integrates with HubSpot, Salesforce, Pipedrive, and 50+ other tools out of the box. Every call, email, and interaction is automatically logged to your CRM.",
  },
  {
    question: "How natural do the voice agents sound?",
    answer:
      "Our voice agents use state-of-the-art speech synthesis with sub-500ms latency. They handle interruptions, follow complex scripts, and sound indistinguishable from human agents in blind tests.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All data is encrypted in transit and at rest. We are SOC 2 Type II compliant, support SSO, and offer on-premise deployment for Enterprise customers with strict data residency requirements.",
  },
  {
    question: "Can I customize the AI Employee's personality and scripts?",
    answer:
      "Fully. You control tone, vocabulary, escalation rules, and conversation flows. Upload your sales scripts, support FAQs, and brand guidelines — the AI adapts to match your business voice.",
  },
  {
    question: "What happens during the free trial?",
    answer:
      "You get full access to the Growth plan for 14 days, including 2 AI Employees and 500 voice minutes. No credit card required. Our team helps you set up and launch during the trial period.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-white"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about deploying AI Employees with Atlas AI."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] px-6 sm:px-8"
        >
          {faqs.map((item, i) => (
            <FAQAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

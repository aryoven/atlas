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
      "An AI Employee is a specialized AI worker you create for a specific role — sales, support, marketing, or custom. It follows your instructions and answers from your uploaded knowledge.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer:
      "ChatGPT is a general chatbot. Aryoven lets you build multiple AI Employees, each trained on your business knowledge, with persistent conversations and source citations.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "Most users create their first AI Employee and upload knowledge in under 5 minutes. No code or engineering team required.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your account data is isolated with row-level security. Knowledge files and conversations are private to your account.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "4 AI Employees, 5 knowledge files, and 100 messages per month. No credit card required to start.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Yes. Move to Pro ($29/month) or Business ($99/month) when you need more employees, unlimited messages, or team features.",
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
          title="Common questions"
          description="Quick answers about Aryoven and AI Employees."
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

"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const audiences = [
  { label: "Founders", initial: "F" },
  { label: "Freelancers", initial: "Fr" },
  { label: "Agencies", initial: "A" },
  { label: "Startups", initial: "S" },
  { label: "SMBs", initial: "B" },
  { label: "Consultants", initial: "C" },
];

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 py-12" aria-label="Built for">
      <Container>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted"
        >
          Built for founders, freelancers &amp; growing teams
        </motion.p>
        <div className="grid grid-cols-3 items-center gap-8 sm:grid-cols-6">
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center gap-2 opacity-50 transition-opacity hover:opacity-80"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm font-bold text-white"
                aria-hidden="true"
              >
                {audience.initial}
              </div>
              <span className="text-xs text-muted">{audience.label}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

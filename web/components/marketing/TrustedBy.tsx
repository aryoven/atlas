"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const companies = [
  { name: "Google", initial: "G" },
  { name: "Microsoft", initial: "M" },
  { name: "HubSpot", initial: "H" },
  { name: "Slack", initial: "S" },
  { name: "Notion", initial: "N" },
  { name: "Stripe", initial: "St" },
];

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 py-12" aria-label="Trusted by">
      <Container>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted"
        >
          Trusted by innovative teams
        </motion.p>
        <div className="grid grid-cols-3 items-center gap-8 sm:grid-cols-6">
          {companies.map((company, i) => (
            <motion.div
              key={company.name}
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
                {company.initial}
              </div>
              <span className="text-xs text-muted">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

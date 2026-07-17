"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I replaced three freelancers with AI Employees. My support and sales questions get answered instantly from our docs.",
    author: "Sarah Chen",
    role: "Founder",
    company: "TechFlow",
    initials: "SC",
  },
  {
    quote:
      "As a solo consultant, Aryoven handles client FAQs while I focus on delivery. Setup took less than 10 minutes.",
    author: "Marcus Williams",
    role: "Freelancer",
    company: "MW Consulting",
    initials: "MW",
  },
  {
    quote:
      "Our small agency runs four AI Employees for different clients. Knowledge stays separated and answers are cited.",
    author: "Elena Rodriguez",
    role: "Agency Owner",
    company: "GrowthLab",
    initials: "ER",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="Testimonials"
          title="Trusted by early adopters"
          description="Founders, freelancers, and small teams getting more done with AI Employees."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="flex h-full flex-col">
                <div className="mb-4 flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-primary text-primary"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-muted">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary"
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-muted">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

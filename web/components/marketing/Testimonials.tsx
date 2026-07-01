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
      "Atlas AI transformed our sales pipeline. Our AI Sales Employee qualifies 3x more leads than our previous SDR team, and it never takes a day off.",
    author: "Sarah Chen",
    role: "VP of Sales",
    company: "TechFlow Inc.",
    initials: "SC",
  },
  {
    quote:
      "We reduced support response times from 4 hours to under 60 seconds. Customer satisfaction jumped 40% in the first month alone.",
    author: "Marcus Williams",
    role: "Head of Customer Success",
    company: "CloudServe",
    initials: "MW",
  },
  {
    quote:
      "The voice agent handles 80% of our inbound calls without human intervention. ROI was positive within the first 30 days.",
    author: "Elena Rodriguez",
    role: "COO",
    company: "MedFirst Clinics",
    initials: "ER",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="Testimonials"
          title="Loved by forward-thinking teams"
          description="See how businesses across industries are using Atlas AI to grow revenue and delight customers."
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

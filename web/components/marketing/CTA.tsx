"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function CTA() {
  return (
    <section id="contact" className="py-20 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-primary/5 to-background px-6 py-16 text-center sm:px-12 lg:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_60%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Build your AI Team today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Create AI Employees that understand your business,
              work with your knowledge, and help your team 24/7.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/signup" size="lg">
                Start Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#demo" variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Free forever • No credit card required • Setup in minutes
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

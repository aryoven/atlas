"use client";

import { motion } from "framer-motion";
import { Play, Monitor, BarChart2 } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Demo() {
  return (
    <section id="demo" className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          badge="Demo"
          title="See Atlas AI in action"
          description="Watch how businesses deploy AI Employees to handle sales, support, and scheduling — all from one dashboard."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-3"
          >
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/10 via-background to-indigo-950/50">
              <button
                type="button"
                className="group flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Play demo video"
              >
                <Play
                  className="ml-1 h-8 w-8 text-white transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="border-t border-white/10 px-4 py-3">
              <p className="text-sm text-muted">
                Platform walkthrough · 3 min
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <Monitor className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-white">Dashboard Preview</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {["Calls", "Leads", "Revenue", "CSAT"].map((metric) => (
                    <div
                      key={metric}
                      className="rounded-lg border border-white/10 bg-white/[0.02] p-3"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-muted">
                        {metric}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {metric === "Calls"
                          ? "1.2k"
                          : metric === "Leads"
                            ? "384"
                            : metric === "Revenue"
                              ? "$48k"
                              : "4.9"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 items-end gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  {[30, 50, 35, 70, 45, 80, 55, 90, 65, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/40"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-primary/5 p-4">
              <BarChart2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm text-muted">
                Average customers see{" "}
                <span className="font-semibold text-white">3.2x ROI</span> within
                90 days of deployment.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

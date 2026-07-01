"use client";

import { motion } from "framer-motion";
import {
  Play,
  TrendingUp,
  Users,
  Phone,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Active AI Employees", value: "12", icon: Users },
  { label: "Calls Handled Today", value: "847", icon: Phone },
  { label: "Revenue Generated", value: "$24.8k", icon: TrendingUp },
];

const activities = [
  "Qualified lead from inbound call",
  "Support ticket resolved in 42s",
  "Appointment booked for tomorrow",
  "Follow-up email sent to prospect",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -left-32 top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[80px]" />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-32 h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_#2563EB]"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute right-1/3 top-48 h-3 w-3 rounded-full bg-blue-400 shadow-[0_0_24px_#60A5FA]"
        />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6">AI Workforce Platform</Badge>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Your{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                AI Workforce
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Deploy AI Employees that qualify leads, handle support, book
              appointments, and make voice calls — working 24/7 to increase
              your business revenue without adding headcount.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="#contact" size="lg">
                Book Demo
              </Button>
              <Button href="#demo" variant="outline" size="lg">
                <Play className="h-4 w-4" aria-hidden="true" />
                Watch Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Trusted by 500+ businesses · No credit card required
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-indigo-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a]/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-muted">Atlas AI Dashboard</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs text-green-400">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <stat.icon className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] leading-tight text-muted">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Recent Activity</span>
                  <Activity className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                <ul className="space-y-2">
                  {activities.map((activity, i) => (
                    <motion.li
                      key={activity}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-2.5 py-2"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" aria-hidden="true" />
                      <span className="truncate text-xs text-muted">{activity}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 p-4">
                <div className="flex h-24 items-end gap-1.5">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                    (height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
                        className={cn(
                          "flex-1 rounded-sm",
                          i === 11 ? "bg-primary" : "bg-primary/30"
                        )}
                      />
                    )
                  )}
                </div>
                <p className="mt-2 text-center text-[10px] text-muted">
                  Weekly performance · +34% vs last month
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

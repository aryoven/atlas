"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Headphones,
  ConciergeBell,
  Mic,
  Mail,
  CalendarCheck,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";

type Employee = {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
};

const employees: Employee[] = [
  {
    icon: TrendingUp,
    title: "Sales Employee",
    description:
      "Qualifies inbound leads, follows up with prospects, and books meetings with your sales team.",
    benefits: ["Lead scoring", "Outbound follow-ups", "Meeting scheduling"],
  },
  {
    icon: Headphones,
    title: "Support Employee",
    description:
      "Resolves customer inquiries instantly across chat, email, and ticketing systems with human-like empathy.",
    benefits: ["Instant responses", "Ticket resolution", "Escalation routing"],
  },
  {
    icon: ConciergeBell,
    title: "Receptionist",
    description:
      "Greets visitors, routes calls, and manages front-desk operations with a professional, always-on presence.",
    benefits: ["Call routing", "Visitor management", "After-hours coverage"],
  },
  {
    icon: Mic,
    title: "Voice Agent",
    description:
      "Handles inbound and outbound phone calls with natural conversation, appointment booking, and data capture.",
    benefits: ["Natural voice AI", "Call transcription", "CRM logging"],
  },
  {
    icon: Mail,
    title: "Email Agent",
    description:
      "Drafts, sends, and manages email sequences for sales outreach, support follow-ups, and nurture campaigns.",
    benefits: ["Personalized outreach", "Auto follow-ups", "Inbox management"],
  },
  {
    icon: CalendarCheck,
    title: "Appointment Setter",
    description:
      "Books demos, consultations, and service appointments directly into your calendar with zero back-and-forth.",
    benefits: ["Calendar sync", "Reminder sequences", "No-show reduction"],
  },
];

export default function AIEmployees() {
  return (
    <section id="solutions" className="relative py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"
        aria-hidden="true"
      />
      <Container className="relative">
        <SectionTitle
          badge="AI Employees"
          title="Hire the AI team your business needs"
          description="Pre-built AI Employees trained for specific roles. Deploy in minutes, customize to your brand, and start generating revenue immediately."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee, i) => (
            <motion.div
              key={employee.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="flex h-full flex-col">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <employee.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white">{employee.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {employee.description}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {employee.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-xs text-muted"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  href="#contact"
                  variant="ghost"
                  size="sm"
                  className="mt-5 w-fit px-0 hover:bg-transparent"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

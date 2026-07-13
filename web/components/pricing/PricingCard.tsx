"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
};

export default function PricingCard({
  title,
  price,
  description,
  features,
  popular = false,
  buttonText,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-white/[0.04] p-8 backdrop-blur-xl transition-all",
        popular
          ? "border-primary shadow-[0_0_60px_rgba(59,130,246,0.20)]"
          : "border-white/10 hover:border-primary/40"
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg">
          ⭐ Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold text-white">
        {title}
      </h3>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-bold text-white">
          {price}
        </span>

        {price !== "Custom" && (
          <span className="pb-2 text-muted">
            /month
          </span>
        )}
      </div>

      <p className="mt-5 text-muted">
        {description}
      </p>

      <ul className="mt-8 space-y-4">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-muted"
          >
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <Button
          className="w-full"
          variant={popular ? "primary" : "secondary"}
        >
          {buttonText}
        </Button>
      </div>
    </motion.div>
  );
}
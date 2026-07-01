"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("relative w-full max-w-md", className)}
    >
      <div className="mb-8 flex justify-center">
        <Link href="/" aria-label="Back to home">
          <Logo />
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-muted">{description}</p>
          )}
        </div>

        {children}

        {footer && (
          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-muted">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

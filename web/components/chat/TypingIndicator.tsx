"use client";

import { cn } from "@/lib/utils";

type TypingIndicatorProps = {
  className?: string;
};

export default function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-1 px-1 py-2", className)}
      aria-label="AI is typing"
      role="status"
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-2 w-2 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${dot * 150}ms` }}
        />
      ))}
    </div>
  );
}

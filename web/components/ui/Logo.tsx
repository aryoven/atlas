import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity hover:opacity-90",
        className
      )}
      aria-label="Aryoven home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 ring-1 ring-primary/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4 text-primary"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>
        Aryo<span className="text-primary">ven</span>
      </span>
    </Link>
  );
}

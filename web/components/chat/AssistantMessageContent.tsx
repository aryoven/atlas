"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type AssistantMessageContentProps = {
  content: string;
  className?: string;
};

export default function AssistantMessageContent({
  content,
  className,
}: AssistantMessageContentProps) {
  return (
    <div className={cn("text-sm leading-relaxed text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          code: ({ className: codeClassName, children }) => {
            const isBlock = Boolean(codeClassName);

            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-xl border border-white/10 bg-background/60 p-4 text-[0.85em] text-primary">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.85em] text-primary">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-xl border border-white/10 bg-background/60 p-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

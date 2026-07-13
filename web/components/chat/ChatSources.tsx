import { FileText } from "lucide-react";
import { getUniqueSourceFilenames, type ChatSource } from "@/lib/types/chat";

type ChatSourcesProps = {
  sources: ChatSource[];
};

export default function ChatSources({ sources }: ChatSourcesProps) {
  const filenames = getUniqueSourceFilenames(sources);

  if (filenames.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
        Sources
      </p>
      <ul className="space-y-1.5">
        {filenames.map((filename) => (
          <li
            key={filename}
            className="flex items-center gap-2 text-xs text-muted"
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden="true" />
            <span className="truncate text-foreground/90">{filename}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Send, Loader2, Paperclip, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = "Message your AI Employee…",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!disabled && !isLoading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-white/10 bg-background/80 p-4 backdrop-blur-xl">
      <div className="mx-auto max-w-3xl">

        {attachment && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Paperclip className="h-4 w-4" />
              <span>{attachment.name}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setAttachment(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="text-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt,.csv,.png,.jpg,.jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setAttachment(file);
              }
            }}
          />

          <Button
            type="button"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="h-11 w-11 shrink-0 rounded-xl p-0"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              "max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
            )}
            aria-label="Chat message"
          />

          <Button
            type="button"
            size="sm"
            onClick={onSend}
            disabled={disabled || isLoading || !value.trim()}
            className="h-11 w-11 shrink-0 rounded-xl p-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>

        </div>

      </div>

      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
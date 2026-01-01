"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SuggestionsProps = ComponentProps<"div">;

export function Suggestions({ className, children, ...props }: SuggestionsProps) {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Get emoji prefix based on suggestion content
function getSuggestionEmoji(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("code") || lowerText.includes("function") || lowerText.includes("build")) return "💻";
  if (lowerText.includes("chart") || lowerText.includes("graph") || lowerText.includes("visualiz")) return "📊";
  if (lowerText.includes("form") || lowerText.includes("input") || lowerText.includes("survey")) return "📝";
  if (lowerText.includes("help") || lowerText.includes("explain") || lowerText.includes("how")) return "💡";
  if (lowerText.includes("write") || lowerText.includes("create") || lowerText.includes("generate")) return "✍️";
  if (lowerText.includes("analyze") || lowerText.includes("review") || lowerText.includes("check")) return "🔍";
  return "✨";
}

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export function Suggestion({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  const emoji = getSuggestionEmoji(suggestion);

  return (
    <Button
      className={cn(
        "cursor-pointer rounded-full px-4 transition-all duration-200",
        "hover:border-accent hover:bg-accent/10 hover:scale-[1.02]",
        className
      )}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      <span className="mr-1.5">{emoji}</span>
      {children || suggestion}
    </Button>
  );
}

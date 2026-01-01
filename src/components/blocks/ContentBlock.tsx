"use client";

import { motion } from "motion/react";
import type { ContentBlock as ContentBlockType } from "@/types";
import { FormContent } from "./FormContent";
import { ChartContent } from "./ChartContent";
import { CodeContent } from "./CodeContent";
import { CardContent } from "./CardContent";
import { PortfolioBlock } from "./PortfolioBlock";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Type-based accent colors for visual distinction
const blockTypeStyles: Record<ContentBlockType["type"], string> = {
  form: "border-l-4 border-l-purple-500",
  chart: "border-l-4 border-l-teal-500",
  code: "border-l-4 border-l-green-500",
  card: "border-l-4 border-l-orange-500",
  portfolio: "border-l-4 border-l-pink-500",
};

interface ContentBlockProps {
  content: ContentBlockType;
  messageId: string;
}

export function ContentBlock({ content, messageId }: ContentBlockProps) {
  const renderContent = () => {
    switch (content.type) {
      case "form":
        return <FormContent data={content} messageId={messageId} />;
      case "chart":
        return <ChartContent data={content} />;
      case "code":
        return <CodeContent data={content} />;
      case "card":
        return <CardContent data={content} />;
      case "portfolio":
        return <PortfolioBlock data={content} />;
      default:
        return null;
    }
  };

  const borderStyle = blockTypeStyles[content.type] || "";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={cn("my-3 w-full rounded-lg", borderStyle)}
    >
      {renderContent()}
    </motion.div>
  );
}

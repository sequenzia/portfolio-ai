import { tool } from "ai";
import {
  FormContentDataSchema,
  ChartContentDataSchema,
  CodeContentDataSchema,
  CardContentDataSchema,
  PortfolioContentDataSchema,
} from "@/types/message";

export const generateForm = tool({
  description:
    "Generate an interactive form for collecting user input. Use for surveys, registrations, feedback forms, or any structured data collection.",
  inputSchema: FormContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const generateChart = tool({
  description:
    'Generate a data visualization chart. Include "data" array with {label, value} objects.',
  inputSchema: ChartContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const generateCode = tool({
  description: "Generate a code block with syntax highlighting.",
  inputSchema: CodeContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const generateCard = tool({
  description:
    "Generate a rich content card for displaying structured information with optional media and actions.",
  inputSchema: CardContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const renderPortfolio = tool({
  description: `Display portfolio content in the chat. Use when:
- User asks about bio, experience, projects, education, skills, or contact info
- User wants to "see" or "show" portfolio information
- Visual content would enhance understanding of the portfolio

Parameters:
- viewType: The portfolio section to display (bio, experience, projects, education, skills, contact)
- filter: Optional search filter (e.g., "ai" for AI projects, company name for experience)
- highlightId: Optional ID of specific item to focus on (e.g., "proj-1", "exp-2")`,
  inputSchema: PortfolioContentDataSchema,
  strict: true,
  execute: async (params) => params,
});

export const chatTools = {
  generateForm,
  generateChart,
  generateCode,
  generateCard,
};

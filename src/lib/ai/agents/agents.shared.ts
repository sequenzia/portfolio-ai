/**
 * Shared agent metadata
 *
 * Single source of truth for agent metadata (id, name, description, suggestions).
 * This file has no server-only dependencies and can be imported anywhere.
 */

export interface AgentMetadata {
  id: string;
  name: string;
  description?: string;
  greeting?: string;
  suggestions?: Array<{ label: string; prompt?: string }>;
}

export const defaultAgentMeta: AgentMetadata = {
  id: "default",
  name: "Sequenzia",
  description: "Default AI Agent with interactive content generation",
  greeting: "I can create forms, charts, code, and more. What would you like to build?",
  suggestions: [
    {
      label: "Create a feedback form",
      prompt:
        "Create a feedback form for my website with fields for name, email, rating, and comments.",
    },
    {
      label: "Show me a chart",
      prompt: "Show me a bar chart example with sample data for monthly sales.",
    },
    {
      label: "Generate TypeScript code",
      prompt:
        "Generate a TypeScript utility function that debounces function calls.",
    },
    {
      label: "Create a product card",
      prompt:
        "Create a product card with an image, title, description, price, and add to cart button.",
    },
  ],
};

export const portfolioAgentMeta: AgentMetadata = {
  id: "portfolio",
  name: "Portfolio Agent",
  description: "Interactive Portfolio Agent",
  greeting: "Let's chat — ask me anything about my work, background, or projects.",
  suggestions: [
    {
      label: "Bio",
      prompt: "Show me your bio",
    },
    {
      label: "Experience",
      prompt: "Show me your experience",
    },
    {
      label: "Projects",
      prompt: "Show me your projects",
    },
    {
      label: "Education",
      prompt: "Show me your education",
    },
    {
      label: "Skills",
      prompt: "Show me your skills",
    },
    {
      label: "Contact",
      prompt: "Show me your contact information",
    },
  ],
};

export const AGENTS: AgentMetadata[] = [
  defaultAgentMeta,
  portfolioAgentMeta,
];

export const DEFAULT_AGENT_ID = "default";

export function getAgentMetadataById(id: string): AgentMetadata | undefined {
  return AGENTS.find((agent) => agent.id === id);
}

export function listAgentMetadata(): AgentMetadata[] {
  return AGENTS;
}

import "server-only";

import type { AgentConfig } from "./types";
import { defaultAgent } from "./default.agent";
import { portfolioAgent } from "./portfolio.agent";
import { DEFAULT_AGENT_ID } from "@/config";

// Registry of all available agents
const agents: Record<string, AgentConfig> = {
  [defaultAgent.id]: defaultAgent,
  [portfolioAgent.id]: portfolioAgent,
};

/**
 * Get the currently active agent based on ACTIVE_AGENT env var
 */
export function getActiveAgent(): AgentConfig {
  const agentId = DEFAULT_AGENT_ID;

  const agent = agents[agentId];

  if (!agent) {
    console.warn(
      `Agent "${agentId}" not found, falling back to "default"`
    );
    return agents["default"];
  }

  return agent;
}

/**
 * Get an agent by ID
 */
export function getAgentById(id: string): AgentConfig | undefined {
  return agents[id];
}

/**
 * List all available agent IDs
 */
export function listAgentIds(): string[] {
  return Object.keys(agents);
}

export type { AgentConfig };

import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createModel } from "@/lib/ai/models.server";
import { getActiveAgent, getAgentById } from "@/lib/ai/agents";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages: uiMessages, modelId, agentId } = await req.json();

  const model = createModel(modelId);
  const messages = await convertToModelMessages(uiMessages);

  // Use client-selected agent if provided, otherwise fall back to env var
  const agent = (agentId ? getAgentById(agentId) : undefined) ?? getActiveAgent();

  const result = streamText({
    model,
    system: agent.instructions,
    messages,
    tools: agent.tools,
    stopWhen: stepCountIs(agent.maxSteps ?? 1),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}

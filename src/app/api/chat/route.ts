import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createModel } from "@/lib/ai/models.server";
import { getActiveAgent } from "@/lib/ai/agents";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages: uiMessages, modelId } = await req.json();

  const model = createModel(modelId);
  const messages = await convertToModelMessages(uiMessages);

  // Get the active agent configuration
  const agent = getActiveAgent();

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

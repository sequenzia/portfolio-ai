import { streamText, convertToModelMessages } from "ai";
import { createModel } from "@/lib/ai/models.server";
import { getSystemPrompt } from "@/lib/ai/prompts";
import { chatTools } from "@/lib/ai/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages: uiMessages, modelId } = await req.json();

  const model = createModel(modelId);
  const messages = await convertToModelMessages(uiMessages);

  const result = streamText({
    model,
    system: getSystemPrompt(),
    messages,
    tools: chatTools,
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}

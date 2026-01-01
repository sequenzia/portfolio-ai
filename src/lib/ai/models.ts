// Client-safe model definitions
export interface Model {
  id: string;
  name: string;
  provider: string;
  providerSlug: string;
  description?: string;
}

export const MODELS: Model[] = [
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    providerSlug: "openai",
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerSlug: "openai",
    description: "Balanced performance",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    providerSlug: "google",
    description: "Fast multimodal model",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    providerSlug: "deepseek",
    description: "Advanced reasoning",
  },
];

export const DEFAULT_MODEL_ID = "openai/gpt-4o-mini";

export function getModelById(id: string): Model | undefined {
  return MODELS.find((model) => model.id === id);
}

export function isValidModelId(id: string): boolean {
  return MODELS.some((model) => model.id === id);
}

export function getModelsByProvider(): Map<string, Model[]> {
  const grouped = new Map<string, Model[]>();
  for (const model of MODELS) {
    const existing = grouped.get(model.provider) || [];
    grouped.set(model.provider, [...existing, model]);
  }
  return grouped;
}

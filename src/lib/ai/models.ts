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
    id: "openai/gpt-5-nano",
    name: "GPT-5 Nano",
    provider: "OpenAI",
    providerSlug: "openai",
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    providerSlug: "openai",
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    providerSlug: "openai",
    description: "Fast and efficient",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "OpenAI",
    providerSlug: "baseten",
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    providerSlug: "google",
    description: "Fast multimodal model",
  },
  {
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    provider: "DeepSeek",
    providerSlug: "deepseek",
    description: "Fast and efficient",
  }
];

export const DEFAULT_MODEL_ID = "openai/gpt-oss-120b";

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

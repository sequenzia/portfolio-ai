import "server-only";

import { gateway, wrapLanguageModel, type LanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { DEFAULT_MODEL_ID, isValidModelId } from "./models";

const isDebugEnabled = process.env.AI_DEBUG === "true";

export function createModel(modelId?: string): LanguageModel {
  const selectedModelId = isValidModelId(modelId ?? "")
    ? modelId!
    : DEFAULT_MODEL_ID;

  const baseModel = gateway(selectedModelId);

  return isDebugEnabled
    ? wrapLanguageModel({ model: baseModel, middleware: devToolsMiddleware() })
    : baseModel;
}

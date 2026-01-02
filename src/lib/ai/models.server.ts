import "server-only";

import { gateway, wrapLanguageModel, type LanguageModel } from "ai";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { isValidModelId } from "./models";
import { DEFAULT_MODEL_ID, DEBUG_ON } from "@/config";

export function createModel(modelId?: string): LanguageModel {
  const selectedModelId = isValidModelId(modelId ?? "")
    ? modelId!
    : DEFAULT_MODEL_ID;

  const baseModel = gateway(selectedModelId);

  return DEBUG_ON
    ? wrapLanguageModel({ model: baseModel, middleware: devToolsMiddleware() })
    : baseModel;
}

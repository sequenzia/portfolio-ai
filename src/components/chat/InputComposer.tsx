"use client";

import { useState } from "react";
import { useChat } from "./ChatProvider";
import { MODELS, getModelsByProvider } from "@/lib/ai/models";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Separator } from "@/components/ui/separator";

export function InputComposer() {
  const { sendMessage, status, modelId, setModelId, stop, isLoading } =
    useChat();
  const [input, setInput] = useState("");
  const modelsByProvider = getModelsByProvider();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    if (status === "streaming") {
      stop();
      return;
    }

    sendMessage(message.text);
    setInput("");
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              className="min-h-[60px] resize-none"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputSelect value={modelId} onValueChange={setModelId}>
                <PromptInputSelectTrigger className="w-[180px] h-8">
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {Array.from(modelsByProvider.entries()).map(
                    ([provider, models], providerIndex) => (
                      <div key={provider}>
                        {providerIndex > 0 && <Separator className="my-1" />}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          {provider}
                        </div>
                        {models.map((model) => (
                          <PromptInputSelectItem
                            key={model.id}
                            value={model.id}
                          >
                            {model.name}
                          </PromptInputSelectItem>
                        ))}
                      </div>
                    )
                  )}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() && !isLoading}
            />
          </PromptInputFooter>
        </PromptInput>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

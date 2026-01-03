## Purpose
This file gives concise, repository-specific guidance for AI coding agents working on Sequenzia AI. Focus on the streaming chat, agents, and inline content blocks patterns used throughout the codebase.

## Quick Start (commands)
- Install: `npm install`
- Dev: `npm run dev` (http://localhost:3000)
- Build: `npm run build` && `npm run start`
- Lint: `npm run lint`
- Env: `cp .env.example .env.local` and set `AI_GATEWAY_API_KEY`, optional `TAVILY_API_KEY`.

## Architecture Snapshot
- Streaming chat pipeline: User → API route → Agent config → Model → Streaming response → Parts-based UI. See [src/app/api/chat/route.ts](src/app/api/chat/route.ts).
- Agents: client-safe metadata vs server-only config. See [src/lib/ai/agents/agents.shared.ts](src/lib/ai/agents/agents.shared.ts) and [src/lib/ai/agents/index.ts](src/lib/ai/agents/index.ts).
- Content blocks/tools: tools produce validated payloads (Zod) and are rendered by `ContentBlock` router. See [src/lib/ai/tools.ts](src/lib/ai/tools.ts), [src/types/message.ts](src/types/message.ts), and [src/components/blocks/ContentBlock.tsx](src/components/blocks/ContentBlock.tsx).

## Key Patterns & Conventions
- Parts-based messages: messages have `text`, `reasoning`, and `tool-*` parts. Render logic in [src/components/chat/ChatMessage.tsx](src/components/chat/ChatMessage.tsx) and [src/components/ai-elements/message.tsx](src/components/ai-elements/message.tsx).
- Agent split: Put UI-safe metadata in `agents.shared.ts`; put system prompts, tools, and server-only instructions in `*.agent.ts`. Never import server-only agent configs into client bundles.
- Adding a content block: (1) add Zod schema in `src/types/message.ts`; (2) add tool implementation in `src/lib/ai/tools.ts`; (3) add renderer under `src/components/blocks/`; (4) add case to `ContentBlock.tsx`; (5) register tool where needed.
- Tools validate inputs with Zod and stream outputs; follow existing tool shapes (form/chart/code/card/portfolio) as examples.

## Files to Inspect First (high ROI)
- API & streaming: [src/app/api/chat/route.ts](src/app/api/chat/route.ts)
- Agent registry: [src/lib/ai/agents/index.ts](src/lib/ai/agents/index.ts)
- Tools: [src/lib/ai/tools.ts](src/lib/ai/tools.ts)
- Message types & schemas: [src/types/message.ts](src/types/message.ts)
- Content block renderers: [src/components/blocks/](src/components/blocks/)
- Chat UI: [src/components/chat/ChatContainer.tsx](src/components/chat/ChatContainer.tsx) and [src/components/chat/InputComposer.tsx](src/components/chat/InputComposer.tsx)
- Portfolio data: [src/lib/portfolio/data.ts](src/lib/portfolio/data.ts)

## Environment & Runtime Flags
- Required: `AI_GATEWAY_API_KEY` (server). Optional: `TAVILY_API_KEY` for web search.
- Client toggles: `NEXT_PUBLIC_DEFAULT_MODEL_ID`, `NEXT_PUBLIC_DEFAULT_AGENT_ID`, `NEXT_PUBLIC_AGENT_SELECTOR_ON` (enable runtime agent switching), `NEXT_PUBLIC_DEBUG_ON` (AI SDK devtools).

## Common Edits & Pitfalls
- When changing agents: update `agents.shared.ts`, add `*.agent.ts` server config, and register in `src/lib/ai/agents/index.ts`; restart dev server.
- Keep client imports limited to `agents.client.ts` / `agents.shared.ts`. Importing server-only agent files into client code will break builds.
- When adding UI renderers, prefer small focused components under `src/components/blocks/portfolio` or `src/components/blocks/` to match existing structure.
- Streaming behavior: tests or changes that affect streaming must preserve the parts-based structure (parts → UI routing). See `toUIMessageStreamResponse` usage in the API route.

## Small Examples
- Add a new agent metadata entry in `agents.shared.ts` and a server config `my.agent.ts`; set `NEXT_PUBLIC_DEFAULT_AGENT_ID=my` to test in UI.
- Add a chart block: add schema in `src/types/message.ts`, create `ChartContent.tsx`, add case to `ContentBlock.tsx`, and expose tool in `src/lib/ai/tools.ts`.

## Where to Look for More Context
- High-level docs: [README.md](README.md) and [docs/blocks.md](docs/blocks.md)
- Internal guidance: [CLAUDE.md](CLAUDE.md)

If anything above is unclear or you want me to expand a section (examples, code snippets, or a checklist for adding new agents/blocks), tell me which part to iterate on.

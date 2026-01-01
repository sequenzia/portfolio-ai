# Sequenzia AI Overview

Sequenzia AI is a streaming chat application that renders interactive content directly within the conversation. Instead of displaying AI-generated artifacts in separate panels or modals, forms, charts, code snippets, and cards appear inline as part of the message flow. This keeps the conversation contextual and interactive.

The app uses a configurable **agent system** where each agent has its own personality, tools, and suggestions. The `default` agent can generate forms, charts, code, and cards. The `portfolio` agent showcases professional experience through an interactive chat interface. Agents are selected via environment variable and define the system prompt, available tools, and quick-start suggestions shown to users.

Built with Next.js 16, React 19, and the Vercel AI SDK v6, the app streams responses token-by-token and renders message parts (text, reasoning, tool outputs) as they arrive. Styling uses Tailwind CSS v4 with an OKLch color system supporting light and dark themes.

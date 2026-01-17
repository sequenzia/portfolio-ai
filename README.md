# Sequenzia AI

A streaming AI chat application that transforms your portfolio into an interactive conversation. Visitors explore your professional background, experience, projects, and skills through natural dialogue with rich inline content blocks.

## Features

- **Conversational Portfolio** - Visitors chat with an AI assistant to explore your work
- **Streaming Responses** - Real-time streaming with reasoning display
- **Rich Content Blocks** - Interactive portfolio sections, charts, code snippets, forms, and cards
- **Multi-Provider LLM Support** - OpenAI, Google, DeepSeek via AI Gateway
- **Dark Mode** - System, light, and dark themes with OKLch color system
- **Responsive Design** - Mobile-optimized with smooth animations
- **Type-Safe** - Full TypeScript with Zod validation

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1 + React 19.2 + TypeScript |
| AI | Vercel AI SDK v6 + AI Gateway |
| UI | shadcn/ui (New York) + Custom AI Elements |
| Styling | Tailwind CSS v4 + OKLch Colors |
| Animation | Framer Motion |
| Validation | Zod v4 |
| State | React Context + TanStack Query |
| Markdown | Streamdown (streaming renderer) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-ai.git
cd portfolio-ai

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file in the root directory:

```env
# Required
AI_GATEWAY_API_KEY=your_ai_gateway_key
TAVILY_API_KEY=your_tavily_key  # For web search (https://tavily.com)

# Optional
NEXT_PUBLIC_DEFAULT_MODEL_ID=openai/gpt-5-nano  # Default: openai/gpt-5-nano
NEXT_PUBLIC_DEBUG_ON=true                        # Enable AI SDK devtools
```

### Development

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Streaming chat endpoint
│   ├── globals.css            # Theme tokens + Tailwind
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main chat page
├── components/
│   ├── ai-elements/           # AI-specific UI (message, input, reasoning)
│   ├── blocks/                # Content block renderers
│   │   ├── portfolio/         # Portfolio section components
│   │   ├── ContentBlock.tsx   # Block router
│   │   ├── ChartContent.tsx   # Chart visualizations
│   │   ├── CodeContent.tsx    # Syntax highlighting
│   │   └── FormContent.tsx    # Dynamic forms
│   ├── chat/                  # Chat management
│   ├── providers/             # React context providers
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── ai/                    # AI configuration + tools
│   ├── motion/                # Animation variants
│   └── portfolio/             # Portfolio data + config
└── types/                     # TypeScript definitions
```

## How It Works

### Architecture

```
User Message
    ↓
ChatProvider (manages conversation state)
    ↓
POST /api/chat { messages, modelId }
    ↓
streamText({
  model: AI Gateway model,
  system: Portfolio instructions + metadata,
  tools: { renderPortfolio },
})
    ↓
Streaming response (text, reasoning, tool calls)
    ↓
Parts-based rendering:
  • text → Streamdown markdown
  • reasoning → Collapsible display
  • tool-* → Content blocks with animations
```

### Portfolio Tool

The AI has access to a `renderPortfolio` tool that displays portfolio sections:

```typescript
renderPortfolio({
  viewType: "bio" | "experience" | "projects" | "education" | "skills" | "contact",
  filter?: string,      // Filter content (e.g., "ai", "react")
  highlightId?: string, // Focus on specific item
})
```

### Metadata-First System Prompt

The system prompt uses a metadata-first approach that provides the AI with a summary of your portfolio content, reducing token usage by ~40-50% while enabling intelligent tool decisions.

## Customization

### Update Portfolio Content

Edit `src/lib/portfolio/data.ts` with your information:

```typescript
export const portfolioContent: PortfolioContent = {
  bio: {
    name: "Your Name",
    title: "Your Title",
    location: "Your Location",
    summary: "Your professional summary...",
    // ...
  },
  experience: [...],
  projects: [...],
  education: [...],
  skills: [...],
  contact: {...},
};
```

### Configure Greeting & Suggestions

Edit `src/lib/portfolio/config.ts`:

```typescript
export const PORTFOLIO_GREETING = "Your custom greeting message";

export const PORTFOLIO_SUGGESTIONS = [
  { label: "Bio", prompt: "Show me your bio" },
  { label: "Work", prompt: "Tell me about your experience" },
  // Add or modify suggestions
];
```

### Theme Colors

Modify OKLch color tokens in `src/app/globals.css`:

```css
:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(14.08% 0.004 285.82);
  --primary: oklch(20.55% 0.006 285.88);
  /* ... */
}

.dark {
  --background: oklch(13.5% 0.02 265);
  /* ... */
}
```

## Adding Content Blocks

The content block system is extensible. To add a new block type:

1. **Define the schema** in `src/types/message.ts`:
```typescript
export const myBlockSchema = z.object({
  type: z.literal("my-block"),
  data: z.object({ /* your fields */ }),
});
```

2. **Create the tool** in `src/lib/ai/tools.ts`:
```typescript
export const myBlockTool = tool({
  description: "Renders my custom block",
  parameters: myBlockSchema.shape.data,
  execute: async (params) => ({ type: "my-block", data: params }),
});
```

3. **Create the renderer** in `src/components/blocks/MyBlockContent.tsx`

4. **Add to router** in `src/components/blocks/ContentBlock.tsx`:
```typescript
case "my-block":
  return <MyBlockContent data={block.data} />;
```

5. **Register the tool** in `src/app/api/chat/route.ts`

## Available Models

The application supports multiple LLM providers via AI Gateway:

| Provider | Models |
|----------|--------|
| OpenAI | GPT-5 Nano, GPT-5 Mini, GPT-4o Mini, GPT-OSS 120B |
| Google | Gemini 2.0 Flash |
| DeepSeek | DeepSeek V3.2 |

Configure the default model with `NEXT_PUBLIC_DEFAULT_MODEL_ID`.

## Portfolio Data Structure

```typescript
interface PortfolioContent {
  bio: {
    name: string;
    title: string;
    location: string;
    summary: string;
    highlights: string[];
    social: { platform: string; url: string; }[];
  };
  experience: {
    id: string;
    company: string;
    role: string;
    period: string;
    achievements: string[];
    technologies: string[];
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    category: string;
    technologies: string[];
    featured?: boolean;
    links?: { label: string; url: string; }[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    period: string;
    honors?: string;
  }[];
  skills: {
    category: string;
    items: { name: string; proficiency: "expert" | "advanced" | "intermediate"; }[];
  }[];
  contact: {
    email: string;
    calendly?: string;
    social: { platform: string; url: string; }[];
  };
}
```

## License

MIT

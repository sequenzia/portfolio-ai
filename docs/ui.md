# Sequenzia AI - UI/UX Documentation

This document provides comprehensive technical documentation for the Sequenzia AI user interface, including architecture, responsive design patterns, theming, and component details.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Responsive Design System](#2-responsive-design-system)
3. [Device-Specific Layouts](#3-device-specific-layouts)
4. [Core Components](#4-core-components)
5. [Theme System](#5-theme-system)
6. [Animation System](#6-animation-system)
7. [Interactive Elements](#7-interactive-elements)
8. [AI Elements Component Library](#8-ai-elements-component-library)
9. [Accessibility](#9-accessibility)

---

## 1. Architecture Overview

### Component Hierarchy

```
HTML (lang="en", suppressHydrationWarning)
└── BODY (Geist fonts, antialiased)
    └── ThemeProvider (light/dark/system theme)
        └── QueryProvider (TanStack Query)
            └── ChatProvider (AI SDK useChat state)
                └── div.flex.flex-col.h-screen.bg-background
                    ├── Header
                    │   ├── Logo + Branding
                    │   ├── New Chat Button (conditional)
                    │   └── Theme Selector Dropdown
                    │
                    └── ChatLayout
                        │
                        ├── [No Messages] → EmptyState
                        │   ├── Sparkles Icon
                        │   ├── Welcome Heading
                        │   ├── Agent Greeting
                        │   ├── Suggestion Pills
                        │   └── InputComposer (responsive positioning)
                        │
                        └── [Has Messages]
                            ├── ChatContainer (flex-1, overflow-hidden)
                            │   └── Conversation (StickToBottom)
                            │       ├── ConversationContent
                            │       │   └── ChatMessage[] (mapped)
                            │       └── ConversationScrollButton
                            │
                            └── InputComposer (fixed bottom)
```

### Provider Stack

| Provider | Location | Purpose |
|----------|----------|---------|
| `ThemeProvider` | `src/components/providers/ThemeProvider.tsx` | Manages light/dark/system themes with localStorage persistence |
| `QueryProvider` | `src/components/providers/QueryProvider.tsx` | TanStack Query client (60s stale time, no refetch on focus) |
| `ChatProvider` | `src/components/chat/ChatProvider.tsx` | Wraps AI SDK's `useChat()`, manages messages, model/agent state |

### Page Structure

```tsx
// src/app/page.tsx
export default async function Home() {
  const agent = getActiveAgent();
  return (
    <ChatProvider agentMetadata={agent} agentSelectorEnabled={AGENT_SELECTOR_ON}>
      <div className="flex flex-col h-screen bg-background">
        <Header />
        <ChatLayout />
      </div>
      <Toaster />
    </ChatProvider>
  );
}
```

---

## 2. Responsive Design System

### Tailwind v4 Breakpoints

| Breakpoint | Min Width | Container Max-Width | Tailwind Class | Usage |
|------------|-----------|---------------------|----------------|-------|
| default | 0px | 100% (with px-4) | - | Mobile phones |
| `sm` | 640px | - | `sm:` | Large phones |
| `md` | 768px | 48rem (768px) | `md:`, `max-w-3xl` | Tablets |
| `lg` | 1024px | 56rem (896px) | `lg:`, `max-w-4xl` | Small desktops |
| `xl` | 1280px | 64rem (1024px) | `xl:`, `max-w-5xl` | Desktops |
| `2xl` | 1536px | 72rem (1152px) | `2xl:`, `max-w-6xl` | Large desktops |

### Consistent Max-Width Pattern

The application uses a consistent responsive max-width pattern across all major components:

```tsx
// Pattern used in Header, ChatContainer, InputComposer
className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4"
```

This ensures:
- Visual alignment between header, content, and input
- Optimal line length for readability (~60-80 characters)
- Graceful scaling from mobile to ultra-wide displays

### Compact Mode (EmptyState)

```tsx
// InputComposer in EmptyState uses narrower widths
className={compact
  ? "max-w-2xl lg:max-w-3xl mx-auto"      // Narrower for welcome screen
  : "max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"  // Full width in chat
}
```

### Mobile-First Approach

All styles are written mobile-first:

```tsx
// Base styles apply to mobile, breakpoint prefixes add larger screen styles
<div className="px-4 md:px-6 lg:px-8">           // Padding scales up
<div className="text-sm md:text-base">           // Text size scales up
<div className="hidden md:block">                // Hidden on mobile, shown on tablet+
<div className="md:hidden">                      // Shown on mobile, hidden on tablet+
```

---

## 3. Device-Specific Layouts

### Desktop (1280px+)

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Logo              [New Chat] [Theme ▼]                  │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ User Message                           ───► │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ ◄─── Assistant Message                      │        │
│     │      (with content blocks, reasoning, etc.) │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│                         [↓ Scroll]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│     ┌─────────────────────────────────────────────┐        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ Send a message...                       │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     │ [Agent ▼] [Model ▼]              [💡] [➤]  │        │
│     └─────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

**Characteristics:**
- Content container: `max-w-5xl` to `max-w-6xl` (1024px-1152px)
- Messages centered with generous whitespace
- InputComposer inline at bottom of chat
- Hover states enabled on interactive elements

### Tablet (768px - 1279px)

```
┌───────────────────────────────────────────┐
│ Header                                     │
│ ┌───────────────────────────────────────┐ │
│ │ Logo        [New Chat] [Theme ▼]      │ │
│ └───────────────────────────────────────┘ │
├───────────────────────────────────────────┤
│                                           │
│   ┌───────────────────────────────────┐  │
│   │ User Message                  ───►│  │
│   └───────────────────────────────────┘  │
│                                           │
│   ┌───────────────────────────────────┐  │
│   │ ◄─── Assistant Message            │  │
│   └───────────────────────────────────┘  │
│                                           │
├───────────────────────────────────────────┤
│   ┌───────────────────────────────────┐  │
│   │ Send a message...                 │  │
│   │ [Agent ▼] [Model ▼]      [💡] [➤] │  │
│   └───────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

**Characteristics:**
- Content container: `max-w-3xl` to `max-w-4xl` (768px-896px)
- Same layout as desktop, narrower container
- InputComposer centered within content on EmptyState

### Mobile (<768px)

#### Empty State (No Messages)

```
┌─────────────────────────┐
│ Header                   │
│ Logo     [New] [Theme]   │
├─────────────────────────┤
│                         │
│         ✨              │
│                         │
│  Welcome to Sequenzia   │
│         AI              │
│                         │
│   Ask me anything!      │
│                         │
│  [Suggestion] [Suggest] │
│  [Suggestion]           │
│                         │
│                         │
├─────────────────────────┤ ◄── Fixed at bottom
│ ┌─────────────────────┐ │
│ │ Send a message...   │ │
│ │ [Agent] [Model] [➤] │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### Chat State (Has Messages)

```
┌─────────────────────────┐
│ Header                   │
│ Logo     [New] [Theme]   │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ User Message    ───►│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ◄─── Assistant      │ │
│ │      Message        │ │
│ └─────────────────────┘ │
│                         │
│         [↓ Scroll]      │
│                         │
├─────────────────────────┤ ◄── Fixed at bottom
│ ┌─────────────────────┐ │
│ │ Send a message...   │ │
│ │ [Agent] [Model] [➤] │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Characteristics:**
- Full-width content with `px-4` (16px) horizontal padding
- InputComposer **fixed at bottom** (not scrollable with content)
- Larger tap targets for touch interaction
- No hover states (tap gestures instead)

### Responsive Input Positioning Logic

```tsx
// src/components/chat/EmptyState.tsx
<div className="flex-1 flex flex-col overflow-hidden">
  {/* Scrollable content area */}
  <div className="flex-1 flex flex-col items-center justify-start pt-[24vh] md:pt-[26vh] p-6 overflow-y-auto">
    {/* Welcome content */}

    {/* InputComposer - visible on md+ screens, centered with content */}
    <div className="hidden md:block">
      <InputComposer hideSuggestions compact />
    </div>
  </div>

  {/* InputComposer - fixed at bottom on mobile only */}
  <div className="md:hidden">
    <InputComposer hideSuggestions compact />
  </div>
</div>
```

---

## 4. Core Components

### Header

**File:** `src/components/Header.tsx`

```tsx
<header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex h-14 items-center justify-between px-4 max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
    {/* Left: Branding */}
    <div className="flex items-center gap-2">
      <Sparkles size={36} />
      <h1 className="font-semibold text-2xl bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
        Sequenzia AI
      </h1>
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-1">
      {hasMessages && <NewChatButton />}
      <ThemeSelector />
    </div>
  </div>
</header>
```

**Features:**
- Fixed height: `h-14` (56px)
- Backdrop blur effect with transparency
- Gradient text for branding
- Conditional "New Chat" button (only shown when messages exist)
- Theme dropdown (Light/Dark/System)

### ChatLayout

**File:** `src/components/chat/ChatLayout.tsx`

```tsx
export function ChatLayout() {
  const { messages } = useChat();

  // Check if there are any visible messages
  const hasMessages = useMemo(() => {
    return messages.some((message) => {
      if (message.role === 'user') return true;
      return message.parts?.some((part) => {
        if (part.type === 'text') return part.text.length > 0;
        if (part.type === 'reasoning') return true;
        if (part.type.startsWith('tool-')) return true;
        return false;
      });
    });
  }, [messages]);

  if (!hasMessages) {
    return <EmptyState />;
  }

  return (
    <>
      <ChatContainer className="flex-1 overflow-hidden" />
      <InputComposer />
    </>
  );
}
```

**Logic:**
- Shows `EmptyState` when no visible content
- Shows `ChatContainer` + `InputComposer` when messages exist
- Memoized visibility check for performance

### EmptyState

**File:** `src/components/chat/EmptyState.tsx`

| Prop | Type | Description |
|------|------|-------------|
| - | - | Uses ChatProvider context for agentId, suggestions, sendMessage |

**Features:**
- Centered welcome content with `pt-[24vh]` (mobile) / `pt-[26vh]` (tablet+)
- Sparkles icon (96px)
- Gradient heading with agent-specific greeting
- Suggestion pills from agent configuration
- Responsive InputComposer positioning

### ChatContainer

**File:** `src/components/chat/ChatContainer.tsx`

```tsx
<Conversation className="flex-1">
  <ConversationContent className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-6">
    {visibleMessages.map((message, index) => (
      <ChatMessage key={message.id} message={message} isLast={index === visibleMessages.length - 1} />
    ))}

    <AnimatePresence>
      {showLoading && (
        <motion.div variants={fadeInUp} className="flex items-center gap-2 text-accent text-sm">
          <Loader size={16} />
          <Sparkles size={16} />
          <span>Thinking...</span>
        </motion.div>
      )}
    </AnimatePresence>
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

**Features:**
- Auto-scroll to bottom using `use-stick-to-bottom`
- Filters messages to only show those with content
- Loading indicator with animated entrance
- Scroll-to-bottom button when scrolled up

### InputComposer

**File:** `src/components/chat/InputComposer.tsx`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hideAgentSelector` | boolean | false | Hides the agent selector button |
| `hideSuggestions` | boolean | false | Hides the suggestions hover card |
| `compact` | boolean | false | Uses narrower max-width (for EmptyState) |

```tsx
<div className="bg-gradient-to-t from-background via-background to-transparent p-4 pb-6">
  <div className={compact ? "max-w-2xl lg:max-w-3xl mx-auto" : "max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"}>
    {/* Gradient border wrapper */}
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-gradient-from via-accent to-gradient-to shadow-lg shadow-accent/10">
      <div className="rounded-2xl bg-card/95 backdrop-blur-sm">
        <PromptInput>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Send a message..." className="min-h-[60px]" />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {agentSelectorEnabled && <AgentSelector />}
              <ModelSelector />
            </PromptInputTools>
            <div className="flex items-center gap-1">
              {!hideSuggestions && <SuggestionsHoverCard />}
              <PromptInputSubmit />
            </div>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  </div>
</div>
```

**Features:**
- Gradient fade background (transparent at top)
- Gradient border using 1px wrapper technique
- Auto-growing textarea with `min-h-[60px]`
- Agent/Model selectors in footer
- Suggestions hover card with lightbulb icon
- Submit button changes icon based on status

### ChatMessage

**File:** `src/components/chat/ChatMessage.tsx`

**Parts-Based Rendering:**

| Part Type | Component | Description |
|-----------|-----------|-------------|
| `text` | `<MessageResponse>` | Markdown content via Streamdown |
| `reasoning` | `<Reasoning>` | Collapsible thinking process |
| `tool-invocation` | `<ContentBlock>` or `<Tool>` | Content blocks for specific tools, loader for others |
| `tool-result` | - | Handled by tool-invocation rendering |

**Content Block Tools:**
- `generateForm` → `<FormContent>`
- `generateChart` → `<ChartContent>`
- `generateCode` → `<CodeContent>`
- `generateCard` → `<CardContent>`
- `renderPortfolio` → `<PortfolioBlock>`

**Message Actions:**
- Copy button (copies all text parts)
- Regenerate button (only on last assistant message)

---

## 5. Theme System

### OKLch Color Variables

The application uses OKLch color space for perceptually uniform colors:

**File:** `src/app/globals.css`

#### Light Mode (`:root`)

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `oklch(100% 0 0)` | Page background (white) |
| `--foreground` | `oklch(9.6% 0.005 286.07)` | Primary text (near black) |
| `--card` | `oklch(100% 0 0)` | Card backgrounds |
| `--card-foreground` | `oklch(9.6% 0.005 286.07)` | Card text |
| `--primary` | `oklch(20.5% 0 0)` | Primary actions (dark) |
| `--primary-foreground` | `oklch(98.5% 0 0)` | Text on primary (light) |
| `--secondary` | `oklch(96.5% 0.015 285)` | Secondary backgrounds |
| `--secondary-foreground` | `oklch(15.5% 0.004 286.07)` | Secondary text |
| `--muted` | `oklch(96.5% 0.015 285)` | Muted backgrounds |
| `--muted-foreground` | `oklch(45.2% 0.012 256.07)` | Muted text |
| `--accent` | `oklch(65% 0.22 285)` | Accent color (vibrant purple-blue) |
| `--accent-foreground` | `oklch(98% 0 0)` | Text on accent |
| `--border` | `oklch(91.4% 0.02 285)` | Border color |
| `--input` | `oklch(91.4% 0.02 285)` | Input borders |
| `--ring` | `oklch(65% 0.18 285)` | Focus rings |
| `--gradient-from` | `oklch(65% 0.22 285)` | Gradient start |
| `--gradient-to` | `oklch(60% 0.20 320)` | Gradient end |

#### Dark Mode (`.dark`)

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `oklch(13.5% 0.02 265)` | Page background (deep blue-gray) |
| `--foreground` | `oklch(98% 0 0)` | Primary text (near white) |
| `--card` | `oklch(19% 0.02 260)` | Card backgrounds |
| `--primary` | `oklch(98% 0 0)` | Primary actions (light) |
| `--primary-foreground` | `oklch(13.5% 0 0)` | Text on primary (dark) |
| `--secondary` | `oklch(22% 0.02 260)` | Secondary backgrounds |
| `--accent` | `oklch(65% 0.22 260)` | Accent color (hue-shifted for dark) |
| `--border` | `oklch(28% 0.02 260)` | Border color |

#### Semantic Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-success` | `oklch(72% 0.19 142.5)` | Success states (green) |
| `--color-warning` | `oklch(79.5% 0.184 86.05)` | Warning states (yellow) |
| `--color-error` | `oklch(57.7% 0.245 27.33)` | Error states (red) |
| `--color-info` | `oklch(62.3% 0.214 259.07)` | Info states (blue) |

### Theme Implementation

**File:** `src/components/providers/ThemeProvider.tsx`

```tsx
type Theme = 'light' | 'dark' | 'system';

// Theme context provides:
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}
```

**Features:**
- Persists to localStorage (`sequenzia-theme`)
- Listens to system `prefers-color-scheme` changes
- Applies class to `<html>`: `.light`, `.dark`, or `.high-contrast`
- Hydration-safe (renders only after mount)

### Class-Based Dark Mode

```css
/* Enable class-based dark mode (instead of media query) */
@custom-variant dark (&:where(.dark, .dark *));
```

This allows Tailwind's `dark:` prefix to work with the `.dark` class:

```tsx
<div className="bg-background dark:bg-card">
  <p className="text-foreground dark:text-muted-foreground">
```

---

## 6. Animation System

### Spring Presets

**File:** `src/lib/motion/variants.ts`

```typescript
export const springPresets = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },  // Smooth, natural
  snappy: { type: 'spring', stiffness: 400, damping: 30 },  // Quick, responsive
  bouncy: { type: 'spring', stiffness: 300, damping: 10 },  // Playful, energetic
};
```

### Entrance Animations

| Variant | Initial | Animate | Transition |
|---------|---------|---------|------------|
| `fadeIn` | `opacity: 0` | `opacity: 1` | 0.2s ease-out |
| `fadeInUp` | `opacity: 0, y: 8` | `opacity: 1, y: 0` | 0.3s ease-out |
| `fadeInScale` | `opacity: 0, scale: 0.95` | `opacity: 1, scale: 1` | gentle spring |

### Message Animations

```typescript
export const messageItemUser = {
  hidden: { opacity: 0, x: 12 },    // Slides from right
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const messageItemAssistant = {
  hidden: { opacity: 0, x: -12 },   // Slides from left
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};
```

### Content Block Animations

| Block Type | Variant | Motion |
|------------|---------|--------|
| Charts | `chartEntrance` | Scale up (0.96 → 1) with gentle spring |
| Code | `codeEntrance` | Slide from left (-16px) with snappy spring |
| Cards | `cardEntrance` | Slide up (12px) with gentle spring |

### Gesture Animations

```typescript
export const buttonTap = { scale: 0.97 };      // Desktop tap
export const buttonTapMobile = { scale: 0.95 }; // Mobile tap (more pronounced)
export const buttonHover = { scale: 1.02 };     // Hover growth
```

### Motion Hooks

**File:** `src/lib/motion/hooks.ts`

```typescript
// Detect user's reduced motion preference
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // Listens to prefers-reduced-motion media query
}

// Detect mobile viewport
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  // Returns true if viewport < 768px
}

// Get platform-specific animation config
export function useAnimationConfig() {
  const isMobile = useIsMobile();
  return {
    tapGesture: isMobile ? buttonTapMobile : buttonTap,
    hoverGesture: isMobile ? {} : buttonHover,  // No hover on mobile
  };
}
```

### Reduced Motion Support

```css
/* src/app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Interactive Elements

### Model Selector

**File:** `src/components/ai-elements/model-selector.tsx`

A command palette-style dialog for selecting AI models:

```tsx
<ModelSelector open={open} onOpenChange={setOpen}>
  <ModelSelectorTrigger asChild>
    <Button variant="outline" size="sm">
      <ModelSelectorLogo provider={selectedModel.chefSlug} />
      <ModelSelectorName>{selectedModel.name}</ModelSelectorName>
    </Button>
  </ModelSelectorTrigger>
  <ModelSelectorContent>
    <ModelSelectorInput placeholder="Search models..." />
    <ModelSelectorList>
      {chefs.map((chef) => (
        <ModelSelectorGroup key={chef} heading={chef}>
          {models.filter(m => m.chef === chef).map((model) => (
            <ModelSelectorItem key={model.id} value={model.id}>
              <ModelSelectorLogo provider={model.chefSlug} />
              <ModelSelectorName>{model.name}</ModelSelectorName>
              {model.id === selectedId && <CheckIcon />}
            </ModelSelectorItem>
          ))}
        </ModelSelectorGroup>
      ))}
    </ModelSelectorList>
  </ModelSelectorContent>
</ModelSelector>
```

**Features:**
- Built on cmdk (Command Menu)
- Grouped by provider (OpenAI, Google, etc.)
- Provider logos from `models.dev/logos/{provider}.svg`
- Keyboard searchable
- Check mark on selected model

### Agent Selector

**File:** `src/components/ai-elements/agent-selector.tsx`

Similar to Model Selector but for agents:

```tsx
<AgentSelector>
  <AgentSelectorTrigger>
    <BotIcon />
    <AgentSelectorName>{agent.name}</AgentSelectorName>
  </AgentSelectorTrigger>
  <AgentSelectorContent>
    <AgentSelectorInput placeholder="Search agents..." />
    <AgentSelectorList>
      {agents.map((agent) => (
        <AgentSelectorItem key={agent.id} value={agent.id}>
          <AgentSelectorName>{agent.name}</AgentSelectorName>
          <AgentSelectorDescription>{agent.description}</AgentSelectorDescription>
        </AgentSelectorItem>
      ))}
    </AgentSelectorList>
  </AgentSelectorContent>
</AgentSelector>
```

### Suggestions

**File:** `src/components/ai-elements/suggestion.tsx`

#### Suggestion Pills (EmptyState)

```tsx
<Suggestions>
  {suggestions.map((s) => (
    <Suggestion key={s.label} suggestion={s.prompt ?? s.label} onClick={sendMessage}>
      {s.label}
    </Suggestion>
  ))}
</Suggestions>
```

- Pill-shaped buttons with dynamic icons
- Icons based on content (bio, projects, code, chart, etc.)
- Scale animation on hover/tap

#### SuggestionsHoverCard (InputComposer)

```tsx
<SuggestionsHoverCard suggestions={suggestions} onSuggestionClick={handleClick} />
```

- Lightbulb icon button
- Popover opens above input
- Same pill styling inside

### Message Actions

```tsx
<MessageActions>
  <MessageAction tooltip="Copy" onClick={handleCopy}>
    <CopyIcon />
  </MessageAction>
  {isLast && (
    <MessageAction tooltip="Regenerate" onClick={handleRegenerate}>
      <RefreshCwIcon />
    </MessageAction>
  )}
</MessageActions>
```

- Copy: Copies all text parts to clipboard
- Regenerate: Re-sends last user message (only on last assistant message)

### Scroll-to-Bottom Button

```tsx
<ConversationScrollButton />
```

- Appears when user scrolls up from bottom
- Centered at bottom of chat container
- Click scrolls smoothly to bottom

---

## 8. AI Elements Component Library

### Message Components

**File:** `src/components/ai-elements/message.tsx`

| Component | Description |
|-----------|-------------|
| `Message` | Root wrapper with role-based styling |
| `MessageContent` | Content container with max-width |
| `MessageResponse` | Markdown renderer using Streamdown |
| `MessageActions` | Action buttons container |
| `MessageAction` | Individual action with tooltip |
| `MessageAttachment` | Single file/image attachment |
| `MessageAttachments` | Attachment list container |
| `MessageBranch` | Branch container for multiple responses |
| `MessageBranchContent` | Toggleable branch content |
| `MessageBranchSelector` | Prev/Next navigation for branches |

### Conversation Components

**File:** `src/components/ai-elements/conversation.tsx`

| Component | Description |
|-----------|-------------|
| `Conversation` | Auto-scroll container using `use-stick-to-bottom` |
| `ConversationContent` | Inner content wrapper with gap spacing |
| `ConversationScrollButton` | Floating scroll-to-bottom button |

### PromptInput Components

**File:** `src/components/ai-elements/prompt-input.tsx`

| Component | Description |
|-----------|-------------|
| `PromptInput` | Form wrapper with submit handling |
| `PromptInputBody` | Textarea container |
| `PromptInputTextarea` | Auto-growing textarea |
| `PromptInputFooter` | Footer with tools and submit |
| `PromptInputTools` | Container for selectors |
| `PromptInputSubmit` | Send/Stop button with status |

### Reasoning Component

**File:** `src/components/ai-elements/reasoning.tsx`

```tsx
<Reasoning streaming={isStreaming} defaultOpen>
  <ReasoningTrigger>
    <BrainIcon /> Thinking...
  </ReasoningTrigger>
  <ReasoningContent>
    {reasoningText}
  </ReasoningContent>
</Reasoning>
```

- Collapsible container for AI reasoning/thinking
- Auto-opens when streaming starts
- Auto-closes 1s after streaming ends
- Shows duration ("Thought for 5 seconds")

### Tool Component

**File:** `src/components/ai-elements/tool.tsx`

| Status | Badge | Icon |
|--------|-------|------|
| `input-streaming` | Pending | Circle |
| `input-available` | Running | Pulsing clock |
| `approval-requested` | Awaiting Approval | Yellow clock |
| `output-available` | Completed | Green check |
| `output-error` | Error | Red X |

### Loader Components

**File:** `src/components/ai-elements/loader.tsx`

```tsx
<Loader size={16} className="text-accent" />
```

- Custom SVG spinner with 8 rotating segments
- Inherits text color

**File:** `src/components/ai-elements/shimmer.tsx`

```tsx
<Shimmer>Thinking...</Shimmer>
```

- Text shimmer animation effect
- Uses background-position animation
- `bg-clip-text text-transparent` for text effect

---

## 9. Accessibility

### Keyboard Navigation

| Action | Key |
|--------|-----|
| Submit message | Enter |
| New line in input | Shift + Enter |
| Navigate dialogs | Arrow keys |
| Select item | Enter |
| Close dialog | Escape |
| Focus submit | Tab navigation |

### Screen Reader Labels

```tsx
<Button variant="ghost" size="icon">
  <SquarePen className="size-5" />
  <span className="sr-only">New chat</span>  {/* Hidden label */}
</Button>

<Button variant="ghost" size="icon">
  <CurrentIcon className="size-5" />
  <span className="sr-only">Toggle theme</span>
</Button>
```

### ARIA Attributes

```tsx
<Conversation role="log" aria-live="polite" aria-label="Chat messages">
  {/* Messages auto-announced to screen readers */}
</Conversation>

<PromptInputTextarea aria-label="Message input" />
```

### Reduced Motion

All animations respect `prefers-reduced-motion`:

```tsx
const prefersReducedMotion = useReducedMotion();

// Animations automatically disabled when preference is set
<motion.div
  animate={prefersReducedMotion ? {} : animationVariants}
/>
```

### High Contrast Mode

```css
.high-contrast {
  --foreground: oklch(0% 0 0);
  --background: oklch(100% 0 0);
  --border: oklch(0% 0 0);
}

.dark.high-contrast {
  --foreground: oklch(100% 0 0);
  --background: oklch(0% 0 0);
  --border: oklch(100% 0 0);
}
```

Enable via ThemeProvider:

```tsx
const { setHighContrast } = useTheme();
setHighContrast(true);
```

### Focus Management

```tsx
// Focus rings on interactive elements
className="focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"

// Disabled states
className="disabled:pointer-events-none disabled:opacity-50"
```

---

## Quick Reference

### Common Responsive Patterns

```tsx
// Max-width scaling
className="max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4"

// Mobile-first visibility
className="hidden md:block"   // Hidden mobile, shown tablet+
className="md:hidden"         // Shown mobile, hidden tablet+

// Responsive text
className="text-sm md:text-base lg:text-lg"

// Responsive spacing
className="p-4 md:p-6 lg:p-8"
className="gap-2 md:gap-4"
```

### Key Breakpoints

| Device | Breakpoint | Check |
|--------|------------|-------|
| Mobile | < 768px | `md:hidden` or `useIsMobile()` |
| Tablet | 768px - 1023px | `md:` prefix |
| Desktop | 1024px+ | `lg:` prefix |
| Large Desktop | 1280px+ | `xl:` prefix |

### Color Usage

| Purpose | Light Variable | Dark Variable |
|---------|----------------|---------------|
| Backgrounds | `bg-background` | Same (auto-switches) |
| Text | `text-foreground` | Same |
| Muted text | `text-muted-foreground` | Same |
| Borders | `border-border` | Same |
| Accent | `bg-accent text-accent-foreground` | Same |
| Gradients | `from-gradient-from to-gradient-to` | Same |

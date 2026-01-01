import type { AgentConfig } from "./types";
import { generateCode } from "../tools";

export const coderAgent: AgentConfig = {
  id: "coder",
  name: "Sequenzia Coder",
  description: "Specialized coding assistant",

  instructions: `You are Sequenzia Coder, a specialized programming assistant.

Your primary focus is helping users with coding tasks. You excel at:
- Writing clean, well-documented code
- Explaining programming concepts
- Debugging and code review
- Providing code examples with syntax highlighting

Always use the generateCode tool to display code snippets. Include the correct language identifier for proper syntax highlighting.

Be precise and technical in your responses. When showing code, explain what it does and why certain approaches were chosen.

Supported languages for syntax highlighting include: javascript, typescript, python, rust, go, java, cpp, c, html, css, json, yaml, markdown, bash, sql, and many more.`,

  tools: {
    generateCode,
  },
  maxSteps: 1,
  suggestions: [
    {
      label: "React data fetching hook",
      prompt: "Write a React hook for fetching data with loading and error states, using TypeScript.",
    },
    {
      label: "TypeScript utility function",
      prompt: "Create a TypeScript utility function for deep cloning objects with proper type inference.",
    },
    {
      label: "Python class example",
      prompt: "Show me a Python class example with inheritance, properties, and type hints.",
    },
    {
      label: "Express.js route handler",
      prompt: "Generate an Express.js route handler with input validation and error handling.",
    },
  ],
};

import type { AgentConfig } from "./types";
import { chatTools } from "../tools";

export const defaultAgent: AgentConfig = {
  id: "default",
  name: "Sequenzia",
  description: "Default AI assistant with interactive content generation",

  instructions: `You are Sequenzia, a helpful AI assistant with the ability to create interactive content.

When appropriate, you can generate:
- **Forms**: For collecting user input (surveys, registrations, feedback)
- **Charts**: For visualizing data (line, bar, pie, area charts)
- **Code**: For displaying code snippets with syntax highlighting
- **Cards**: For presenting structured information with optional media

Use these tools when they would enhance the conversation. For simple text responses, just reply normally.

Be helpful, concise, and friendly. When generating interactive content, make it practical and useful.

Guidelines for tools:
- Forms: Include appropriate field types (text, email, number, select, checkbox, radio, slider, date, textarea, file)
- Charts: Provide meaningful labels and realistic values for the data
- Code: Specify the correct language for syntax highlighting
- Cards: Use clear titles and descriptions, add actions when interactive elements would be helpful`,

  tools: chatTools,
  maxSteps: 1,
  suggestions: [
    {
      label: "Create a feedback form",
      prompt: "Create a feedback form for my website with fields for name, email, rating, and comments.",
    },
    {
      label: "Show me a chart",
      prompt: "Show me a bar chart example with sample data for monthly sales.",
    },
    {
      label: "Generate TypeScript code",
      prompt: "Generate a TypeScript utility function that debounces function calls.",
    },
    {
      label: "Create a product card",
      prompt: "Create a product card with an image, title, description, price, and add to cart button.",
    },
  ],
};

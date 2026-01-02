// Environment config (NEXT_PUBLIC_ prefix makes these available on client)
export const DEFAULT_MODEL_ID = process.env.NEXT_PUBLIC_DEFAULT_MODEL_ID || 'openai/gpt-5-nano';
export const DEFAULT_AGENT_ID = process.env.NEXT_PUBLIC_DEFAULT_AGENT_ID || 'default';
export const DEBUG_ON = process.env.NEXT_PUBLIC_DEBUG_ON === 'true';
export const AGENT_SELECTOR_ON = process.env.NEXT_PUBLIC_AGENT_SELECTOR_ON === 'true';

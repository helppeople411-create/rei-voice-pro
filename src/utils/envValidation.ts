/**
 * Validates required environment variables and provides user-friendly error messages
 */
export interface EnvConfig {
  geminiApiKey: string;
}

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

export function validateEnvironment(): EnvConfig {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey || geminiApiKey === 'PLACEHOLDER_API_KEY') {
    throw new EnvValidationError(
      'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env.local file. ' +
      'Get your API key from https://aistudio.google.com/apikey'
    );
  }

  return {
    geminiApiKey,
  };
}

/**
 * Safe environment getter with fallback
 */
export function getEnvConfig(): EnvConfig | null {
  try {
    return validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
    return null;
  }
}

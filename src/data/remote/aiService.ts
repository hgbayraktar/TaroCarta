const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface InterpretRequest {
  cardIds: string[];
  question?: string;
  language: string;
}

export interface InterpretResponse {
  interpretation: string;
}

export class AIService {
  async interpret(request: InterpretRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/interpret`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error((error as { message?: string }).message ?? 'Interpretation failed');
    }

    const data = (await response.json()) as InterpretResponse;
    return data.interpretation;
  }
}

export const aiService = new AIService();

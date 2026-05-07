import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const SYSTEM_PROMPT = `You are a wise, supportive tarot reader with deep knowledge of symbolism and psychology.
Use a warm coaching tone — encouraging, never fatalistic. Focus on empowerment and growth.
Keep your interpretation between 150-250 words. Be thoughtful and specific to the cards drawn.
Respond in the language specified by the user.`;

export interface InterpretOptions {
  cardIds: string[];
  question?: string;
  language: string;
}

export async function interpretCards(options: InterpretOptions): Promise<string> {
  const { cardIds, question, language } = options;

  const userMessage = [
    `Cards drawn: ${cardIds.join(', ')}`,
    question ? `Question: ${question}` : null,
    `Language: ${language}`,
  ]
    .filter(Boolean)
    .join('\n');

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 400,
    temperature: 0.8,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  return content;
}

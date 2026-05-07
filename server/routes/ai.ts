import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { interpretCards } from '../services/openaiService';

export const aiRouter = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});

const InterpretSchema = z.object({
  cardIds: z.array(z.string().min(1)).min(1).max(10),
  question: z.string().max(300).optional(),
  language: z.string().length(2).default('en'),
});

type InterpretBody = z.infer<typeof InterpretSchema>;

aiRouter.post('/interpret', limiter, async (req: Request, res: Response) => {
  const parsed = InterpretSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  try {
    const interpretation = await interpretCards(parsed.data);
    res.json({ interpretation });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Interpretation failed';
    console.error('[AI route error]', message);
    res.status(500).json({ error: 'Could not generate interpretation. Please try again.' });
  }
});

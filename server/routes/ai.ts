import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { interpretCards } from '../services/openaiService';
import { requireApiSecret } from '../middleware/auth';

export const aiRouter = Router();

const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'nl', 'ar', 'fa'] as const;
const CARD_ID_PATTERN = /^(major|wands|cups|swords|pentacles)_\d{2}$/;

const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});

const perDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Daily limit reached. Please try again tomorrow.' },
});

const InterpretSchema = z.object({
  cardIds: z
    .array(z.string().regex(CARD_ID_PATTERN))
    .min(1)
    .max(10),
  question: z
    .string()
    .max(200)
    .transform((s) => s.replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\p{P}\s]/gu, '').trim())
    .optional(),
  language: z.enum(SUPPORTED_LANGUAGES).default('en'),
});

aiRouter.post(
  '/interpret',
  requireApiSecret,
  perMinuteLimiter,
  perDayLimiter,
  async (req: Request, res: Response) => {
    const parsed = InterpretSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request' });
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
  }
);

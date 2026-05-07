import type { AIService } from '../../data/remote/aiService';
import type { DrawnCard } from '../entities/Reading';

export interface AIInterpretationRequest {
  cards: DrawnCard[];
  question?: string;
  language: string;
}

export class GetAIInterpretation {
  constructor(private readonly aiService: AIService) {}

  async execute(request: AIInterpretationRequest): Promise<string> {
    return this.aiService.interpret({
      cardIds: request.cards.map((dc) => dc.card.id),
      question: request.question,
      language: request.language,
    });
  }
}

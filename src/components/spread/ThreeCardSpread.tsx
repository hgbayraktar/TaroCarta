import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TarotCard } from '../cards/TarotCard';
import { MysticText } from '../ui/MysticText';
import type { DrawnCard } from '../../domain/entities/Reading';

interface ThreeCardSpreadProps {
  cards: [DrawnCard, DrawnCard, DrawnCard];
  revealedIndices: Set<number>;
  onCardPress: (index: number) => void;
}

const POSITION_KEYS = ['spread.past', 'spread.present', 'spread.future'] as const;

/** Three-card spread layout: Past | Present | Future. */
export function ThreeCardSpread({ cards, revealedIndices, onCardPress }: ThreeCardSpreadProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-3 items-end justify-center">
      {cards.map((drawnCard, i) => (
        <View key={drawnCard.card.id} className="items-center gap-2">
          <MysticText variant="muted" size="xs" style={{ textAlign: 'center' }}>
            {t(POSITION_KEYS[i] ?? 'spread.past')}
          </MysticText>
          <TarotCard
            cardId={drawnCard.card.id}
            isRevealed={revealedIndices.has(i)}
            isReversed={drawnCard.isReversed}
            cardName={revealedIndices.has(i) ? t(drawnCard.card.nameKey) : undefined}
            onPress={() => onCardPress(i)}
            accessibilityLabel={t('accessibility.spread_card', { position: t(POSITION_KEYS[i] ?? 'spread.past') })}
          />
        </View>
      ))}
    </View>
  );
}

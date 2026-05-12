import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SmallCard } from './SmallCard';
import type { DrawnCard } from '../../domain/entities/Reading';

interface RelationshipSpreadProps {
  cards: DrawnCard[];
  revealedIndices: Set<number>;
  onCardPress: (index: number) => void;
}

const POSITION_KEYS = [
  'relationship.you',
  'relationship.partner',
  'relationship.connection',
  'relationship.challenge',
  'relationship.potential',
] as const;

export function RelationshipSpread({ cards, revealedIndices, onCardPress }: RelationshipSpreadProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-4 items-center">
      {/* Top row: You, Connection, Partner */}
      <View className="flex-row gap-3 items-end">
        {[0, 2, 1].map((i) => {
          const dc = cards[i];
          if (!dc) return null;
          return (
            <SmallCard
              key={dc.card.id}
              isRevealed={revealedIndices.has(i)}
              isReversed={dc.isReversed}
              cardName={revealedIndices.has(i) ? t(dc.card.nameKey) : undefined}
              positionLabel={t(POSITION_KEYS[i] ?? 'relationship.you')}
              onPress={() => onCardPress(i)}
              accessibilityLabel={t('accessibility.spread_card', { position: t(POSITION_KEYS[i] ?? 'relationship.you') })}
            />
          );
        })}
      </View>
      {/* Bottom row: Challenge, Potential */}
      <View className="flex-row gap-3 items-end">
        {[3, 4].map((i) => {
          const dc = cards[i];
          if (!dc) return null;
          return (
            <SmallCard
              key={dc.card.id}
              isRevealed={revealedIndices.has(i)}
              isReversed={dc.isReversed}
              cardName={revealedIndices.has(i) ? t(dc.card.nameKey) : undefined}
              positionLabel={t(POSITION_KEYS[i] ?? 'relationship.challenge')}
              onPress={() => onCardPress(i)}
              accessibilityLabel={t('accessibility.spread_card', { position: t(POSITION_KEYS[i] ?? 'relationship.challenge') })}
            />
          );
        })}
      </View>
    </View>
  );
}

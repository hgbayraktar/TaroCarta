import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SmallCard } from './SmallCard';
import type { DrawnCard } from '../../domain/entities/Reading';

interface CelticCrossSpreadProps {
  cards: DrawnCard[];
  revealedIndices: Set<number>;
  onCardPress: (index: number) => void;
}

const POSITION_KEYS = [
  'celtic.present',
  'celtic.challenge',
  'celtic.foundation',
  'celtic.past',
  'celtic.potential',
  'celtic.near_future',
  'celtic.self',
  'celtic.environment',
  'celtic.hopes',
  'celtic.outcome',
] as const;

export function CelticCrossSpread({ cards, revealedIndices, onCardPress }: CelticCrossSpreadProps) {
  const { t } = useTranslation();

  function card(index: number) {
    const dc = cards[index];
    if (!dc) return null;
    return (
      <SmallCard
        key={dc.card.id}
        isRevealed={revealedIndices.has(index)}
        isReversed={dc.isReversed}
        cardName={revealedIndices.has(index) ? t(dc.card.nameKey) : undefined}
        positionLabel={t(POSITION_KEYS[index] ?? 'celtic.present')}
        onPress={() => onCardPress(index)}
        accessibilityLabel={t('accessibility.spread_card', { position: t(POSITION_KEYS[index] ?? 'celtic.present') })}
      />
    );
  }

  return (
    <View className="gap-4 items-center w-full">
      {/* Cross section — 3 columns: past | center stack | future */}
      <View className="gap-3 items-center">
        {/* Crown */}
        <View className="items-center">{card(4)}</View>

        {/* Middle row: past, present/challenge, future */}
        <View className="flex-row gap-3 items-center">
          {card(3)}
          <View className="items-center gap-1">
            {/* Present with challenge overlaid label */}
            {card(0)}
            {card(1)}
          </View>
          {card(5)}
        </View>

        {/* Foundation */}
        <View className="items-center">{card(2)}</View>
      </View>

      {/* Staff — 4 cards in 2x2 grid */}
      <View className="flex-row flex-wrap gap-3 justify-center">
        {card(6)}
        {card(7)}
        {card(8)}
        {card(9)}
      </View>
    </View>
  );
}

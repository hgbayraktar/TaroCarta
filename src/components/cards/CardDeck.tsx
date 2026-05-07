import { View } from 'react-native';
import { TarotCard } from './TarotCard';
import type { DrawnCard } from '../../domain/entities/Reading';
import { useTranslation } from 'react-i18next';

interface CardDeckProps {
  drawnCard: DrawnCard;
  isRevealed: boolean;
  onPress: () => void;
}

/** Single card deck view used on the daily card screen. */
export function CardDeck({ drawnCard, isRevealed, onPress }: CardDeckProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center justify-center">
      <TarotCard
        cardId={drawnCard.card.id}
        isRevealed={isRevealed}
        isReversed={drawnCard.isReversed}
        cardName={isRevealed ? t(drawnCard.card.nameKey) : undefined}
        onPress={onPress}
        accessibilityLabel={
          isRevealed
            ? t('accessibility.card_revealed', { name: t(drawnCard.card.nameKey) })
            : t('accessibility.card_face_down')
        }
      />
    </View>
  );
}

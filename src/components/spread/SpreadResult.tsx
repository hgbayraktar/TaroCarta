import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MysticText } from '../ui/MysticText';
import type { DrawnCard } from '../../domain/entities/Reading';

interface SpreadResultProps {
  cards: DrawnCard[];
  interpretation: string;
}

/** Displays the AI interpretation and drawn card summary for a spread. */
export function SpreadResult({ cards, interpretation }: SpreadResultProps) {
  const { t } = useTranslation();

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-4 p-4">
        <View className="gap-2">
          {cards.map((dc, i) => (
            <View key={dc.card.id} className="flex-row items-center gap-2">
              <MysticText variant="gold" size="sm">•</MysticText>
              <MysticText variant="body" size="sm">
                {t(dc.card.nameKey)}
                {dc.isReversed ? ` (${t('card.reversed')})` : ''}
              </MysticText>
            </View>
          ))}
        </View>

        <View className="h-px bg-border" />

        <MysticText variant="body" size="sm" style={{ lineHeight: 22 }}>
          {interpretation}
        </MysticText>
      </View>
    </ScrollView>
  );
}

import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MysticText } from '../ui/MysticText';
import { useTranslation } from 'react-i18next';

interface CardRevealProps {
  cardNameKey: string;
  isReversed: boolean;
}

/** Animated card name + reversed indicator shown after flip. */
export function CardReveal({ cardNameKey, isReversed }: CardRevealProps) {
  const { t } = useTranslation();

  return (
    <Animated.View entering={FadeIn.duration(400).delay(300)} className="items-center gap-2 mt-6">
      <MysticText variant="gold" size="lg" style={{ textAlign: 'center' }}>
        {t(cardNameKey)}
      </MysticText>
      {isReversed && (
        <MysticText variant="muted" size="sm">
          ↓ {t('card.reversed')}
        </MysticText>
      )}
    </Animated.View>
  );
}

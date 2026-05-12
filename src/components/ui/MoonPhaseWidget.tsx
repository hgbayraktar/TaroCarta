import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getMoonPhase } from '../../utils/moonPhase';
import { MysticText } from './MysticText';

export function MoonPhaseWidget() {
  const { t } = useTranslation();
  const phase = getMoonPhase();

  return (
    <View className="flex-row items-center gap-2 mb-3 px-2 py-1.5 rounded-full bg-surface/60 border border-border/50 self-center">
      <MysticText variant="muted" size="sm">{phase.symbol}</MysticText>
      <MysticText variant="muted" size="xs" className="tracking-wide">
        {t(phase.nameKey)}
      </MysticText>
    </View>
  );
}

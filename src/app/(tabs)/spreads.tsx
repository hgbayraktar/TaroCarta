import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';

export default function SpreadsScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        <MysticText variant="gold" size="xl" className="text-center mb-4">
          {t('tabs.spreads')}
        </MysticText>
        <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
          {t('spreads.coming_soon')}
        </MysticText>
      </SafeAreaView>
    </View>
  );
}

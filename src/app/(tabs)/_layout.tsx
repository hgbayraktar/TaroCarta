import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@constants/colors';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Lato_400Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.home') }}
      />
      <Tabs.Screen
        name="spreads"
        options={{ title: t('tabs.spreads') }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: t('tabs.journal') }}
      />
    </Tabs>
  );
}

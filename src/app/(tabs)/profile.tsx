import { View, ScrollView, TouchableOpacity, Linking, Alert, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';
import { GoldButton } from '@components/ui/GoldButton';
import { PaywallModal } from '@components/paywall/PaywallModal';
import { AdBanner } from '@components/ui/AdBanner';

import { useSubscriptionStore } from '@store/useSubscriptionStore';
import { restorePurchases } from '@services/purchaseService';
import { scheduleDailyReminder, cancelDailyReminder, isReminderEnabled } from '@services/notificationService';
import { PLANS } from '@constants/plans';
import { colors } from '@constants/colors';
import { getBirthCardKey } from '../../utils/numerology';

const APP_VERSION = '1.0.0';
const MANAGE_SUB_URL = 'itms-apps://apps.apple.com/account/subscriptions';

function Row({ label, onPress, right }: { label: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !right}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <MysticText variant="body" size="sm">{label}</MysticText>
      {right ?? (onPress ? <MysticText variant="muted" size="sm">›</MysticText> : null)}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isPremium, activePlanId, expiresAt } = useSubscriptionStore();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthCardKey, setBirthCardKey] = useState<string | null>(null);

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  const activePlan = PLANS.find((p) => p.revenueCatId === activePlanId);

  useEffect(() => {
    isReminderEnabled().then(setReminderEnabled);
  }, []);

  function handleComputeBirthCard() {
    const d = parseInt(birthDay, 10);
    const m = parseInt(birthMonth, 10);
    const y = parseInt(birthYear, 10);
    if (!d || !m || !y || y < 1900 || y > 2025 || m < 1 || m > 12 || d < 1 || d > 31) return;
    const date = new Date(y, m - 1, d);
    setBirthCardKey(getBirthCardKey(date));
  }

  async function handleRestore() {
    setRestoring(true);
    const success = await restorePurchases();
    setRestoring(false);
    if (!success) Alert.alert('', t('paywall.restore_none'));
  }

  async function handleReminderToggle(value: boolean) {
    setReminderLoading(true);
    if (value) {
      const ok = await scheduleDailyReminder(
        t('notification.daily_title'),
        t('notification.daily_body')
      );
      setReminderEnabled(ok);
    } else {
      await cancelDailyReminder();
      setReminderEnabled(false);
    }
    setReminderLoading(false);
  }

  const inputStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    color: colors.text,
    fontFamily: 'Lato_400Regular',
    fontSize: 14,
    textAlign: 'center' as const,
  };

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSuccess={() => setPaywallVisible(false)}
      />
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow px-6 py-8"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-8">
            <MysticText variant="gold" size="sm" className="mb-1 tracking-widest uppercase">
              {t('tabs.profile')}
            </MysticText>
          </Animated.View>

          {/* Subscription status */}
          <Animated.View
            entering={FadeInDown.duration(700).delay(100)}
            className="bg-surface border border-border rounded-2xl p-5 mb-6 items-center gap-3"
          >
            {isPremium ? (
              <>
                <MysticText variant="gold" size="lg" className="text-center">
                  {t('profile.premium_active')}
                </MysticText>
                {activePlan && (
                  <MysticText variant="muted" size="sm" className="text-center">
                    {activePlan.priceUSD} / {activePlan.period}
                  </MysticText>
                )}
                {expiresAt && (
                  <MysticText variant="muted" size="xs" className="text-center">
                    {t('profile.renews')} {expiresAt.toLocaleDateString()}
                  </MysticText>
                )}
              </>
            ) : (
              <>
                <MysticText variant="body" size="md" className="text-center">
                  {t('profile.free_plan')}
                </MysticText>
                <MysticText variant="muted" size="sm" className="text-center">
                  {t('profile.free_description')}
                </MysticText>
                <GoldButton
                  label={t('paywall.subscribe')}
                  onPress={() => setPaywallVisible(true)}
                />
              </>
            )}
          </Animated.View>

          {/* Birth card */}
          <Animated.View
            entering={FadeInDown.duration(700).delay(150)}
            className="bg-surface border border-border rounded-2xl p-5 mb-6 gap-4"
          >
            <MysticText variant="gold" size="md" className="text-center">
              {t('birth.title')}
            </MysticText>
            <MysticText variant="muted" size="xs" className="text-center">
              {t('birth.subtitle')}
            </MysticText>

            <View className="flex-row gap-2 justify-center">
              <View style={{ flex: 1 }}>
                <MysticText variant="muted" size="xs" className="text-center mb-1">{t('birth.day')}</MysticText>
                <TextInput
                  value={birthDay}
                  onChangeText={setBirthDay}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                  placeholderTextColor={colors.textMuted}
                  style={inputStyle}
                />
              </View>
              <View style={{ flex: 1 }}>
                <MysticText variant="muted" size="xs" className="text-center mb-1">{t('birth.month')}</MysticText>
                <TextInput
                  value={birthMonth}
                  onChangeText={setBirthMonth}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor={colors.textMuted}
                  style={inputStyle}
                />
              </View>
              <View style={{ flex: 2 }}>
                <MysticText variant="muted" size="xs" className="text-center mb-1">{t('birth.year')}</MysticText>
                <TextInput
                  value={birthYear}
                  onChangeText={setBirthYear}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="YYYY"
                  placeholderTextColor={colors.textMuted}
                  style={inputStyle}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleComputeBirthCard}
              className="py-2 border border-border rounded-xl items-center"
            >
              <MysticText variant="muted" size="sm">{t('birth.enter_date')}</MysticText>
            </TouchableOpacity>

            {birthCardKey && (
              <View className="items-center gap-1 mt-2">
                <MysticText variant="muted" size="xs">{t('birth.your_card')}</MysticText>
                <MysticText variant="gold" size="md" className="text-center">
                  ✦ {t(birthCardKey)}
                </MysticText>
              </View>
            )}
          </Animated.View>

          {/* Actions */}
          <Animated.View
            entering={FadeInDown.duration(700).delay(200)}
            className="bg-surface border border-border rounded-2xl px-5 mb-6"
          >
            {isPremium && (
              <Row
                label={t('profile.manage_subscription')}
                onPress={() => Linking.openURL(MANAGE_SUB_URL)}
              />
            )}
            <Row
              label={restoring ? t('paywall.restoring') : t('paywall.restore')}
              onPress={handleRestore}
            />
            <Row
              label={t('notification.reminder')}
              right={
                <Switch
                  value={reminderEnabled}
                  onValueChange={handleReminderToggle}
                  disabled={reminderLoading}
                  trackColor={{ false: colors.border, true: colors.gold + '80' }}
                  thumbColor={reminderEnabled ? colors.gold : colors.textMuted}
                />
              }
            />
          </Animated.View>

          {/* App info */}
          <Animated.View
            entering={FadeInDown.duration(700).delay(300)}
            className="bg-surface border border-border rounded-2xl px-5"
          >
            <Row label={`${t('profile.version')} ${APP_VERSION}`} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
      <AdBanner />
    </View>
  );
}

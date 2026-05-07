import { View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';
import { GoldButton } from '@components/ui/GoldButton';
import { PaywallModal } from '@components/paywall/PaywallModal';
import { AdBanner } from '@components/ui/AdBanner';

import { useSubscriptionStore } from '@store/useSubscriptionStore';
import { restorePurchases } from '@services/purchaseService';
import { PLANS } from '@constants/plans';

const APP_VERSION = '1.0.0';
const MANAGE_SUB_URL = 'itms-apps://apps.apple.com/account/subscriptions';

function Row({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-4 border-b border-border"
    >
      <MysticText variant="body" size="sm">{label}</MysticText>
      {onPress && <MysticText variant="muted" size="sm">›</MysticText>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isPremium, activePlanId, expiresAt } = useSubscriptionStore();
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const activePlan = PLANS.find((p) => p.revenueCatId === activePlanId);

  async function handleRestore() {
    setRestoring(true);
    const success = await restorePurchases();
    setRestoring(false);
    if (!success) Alert.alert('', t('paywall.restore_none'));
  }

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
          <Animated.View entering={FadeInDown.duration(600)} className="items-center mb-10">
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

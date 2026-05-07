import { View, Modal, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MysticText } from '../ui/MysticText';
import { GoldButton } from '../ui/GoldButton';
import { colors } from '../../constants/colors';
import { PLANS } from '../../constants/plans';
import { purchasePlan, restorePurchases } from '../../services/purchaseService';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLAN_LABELS: Record<string, { period: string; badge?: string }> = {
  monthly: { period: '/month' },
  quarterly: { period: '/3 mo', badge: 'SAVE 33%' },
  annual: { period: '/year', badge: 'BEST VALUE' },
};

export function PaywallModal({ visible, onClose, onSuccess }: PaywallModalProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>('annual');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  async function handlePurchase() {
    const plan = PLANS.find((p) => p.id === selectedId);
    if (!plan) return;
    setLoading(true);
    try {
      const success = await purchasePlan(plan.revenueCatId);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } catch {
      Alert.alert('Error', t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        onSuccess?.();
        onClose();
      } else {
        Alert.alert('', t('paywall.restore_none'));
      }
    } catch {
      Alert.alert('Error', t('errors.generic'));
    } finally {
      setRestoring(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 40,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <MysticText variant="gold" size="xl" style={{ textAlign: 'center', marginBottom: 8 }}>
                {t('paywall.title')}
              </MysticText>
              <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                {t('paywall.subtitle')}
              </MysticText>
            </View>

            {/* Features */}
            <View style={{ marginBottom: 24, gap: 8 }}>
              {(t('paywall.features', { returnObjects: true }) as string[]).map((f, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MysticText variant="gold" size="sm">✦</MysticText>
                  <MysticText variant="body" size="sm">{f}</MysticText>
                </View>
              ))}
            </View>

            {/* Plans */}
            <View style={{ gap: 10, marginBottom: 24 }}>
              {PLANS.map((plan) => {
                const meta = PLAN_LABELS[plan.id]!;
                const isSelected = selectedId === plan.id;
                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedId(plan.id)}
                    style={{
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected ? colors.gold : colors.border,
                      borderRadius: 14,
                      padding: 16,
                      backgroundColor: isSelected ? colors.surfaceAlt : colors.background,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: isSelected ? colors.gold : colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && (
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: colors.gold,
                            }}
                          />
                        )}
                      </View>
                      <View>
                        <MysticText variant={isSelected ? 'gold' : 'body'} size="sm">
                          {plan.priceUSD}{meta.period}
                        </MysticText>
                        <MysticText variant="muted" size="xs">
                          {plan.perMonthUSD}/month
                        </MysticText>
                      </View>
                    </View>
                    {meta.badge && (
                      <View
                        style={{
                          backgroundColor: colors.gold,
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                        }}
                      >
                        <MysticText
                          variant="body"
                          size="xs"
                          style={{ color: colors.background, fontFamily: 'Lato_700Bold' }}
                        >
                          {meta.badge}
                        </MysticText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <GoldButton
              label={t('paywall.subscribe')}
              onPress={handlePurchase}
              loading={loading}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 16 }}>
              <TouchableOpacity onPress={handleRestore} disabled={restoring}>
                <MysticText variant="muted" size="xs">
                  {restoring ? t('paywall.restoring') : t('paywall.restore')}
                </MysticText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <MysticText variant="muted" size="xs">{t('paywall.not_now')}</MysticText>
              </TouchableOpacity>
            </View>

            <MysticText
              variant="muted"
              size="xs"
              style={{ textAlign: 'center', marginTop: 12, lineHeight: 16 }}
            >
              {t('paywall.terms')}
            </MysticText>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

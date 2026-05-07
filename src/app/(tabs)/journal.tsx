import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';

import { journalRepository } from '@data/repositories/JournalRepository';
import { cardRepository } from '@data/repositories/CardRepository';
import { useSubscriptionStore } from '@store/useSubscriptionStore';
import { PaywallModal } from '@components/paywall/PaywallModal';
import { AdBanner } from '@components/ui/AdBanner';
import { FREE_LIMITS } from '@constants/plans';
import type { JournalEntry } from '@domain/entities/JournalEntry';

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function JournalScreen() {
  const { t, i18n } = useTranslation();
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEntries() {
    setLoading(true);
    const data = await journalRepository.getEntries(50);
    setEntries(data);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  async function handleDelete(id: string) {
    Alert.alert(t('journal.delete'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('journal.delete'),
        style: 'destructive',
        onPress: async () => {
          await journalRepository.deleteEntry(id);
          setEntries((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
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
          <Animated.View entering={FadeInDown.duration(600)} className="items-center w-full mb-8">
            <MysticText variant="gold" size="sm" className="mb-1 tracking-widest uppercase">
              {t('tabs.journal')}
            </MysticText>
          </Animated.View>

          {!loading && entries.length === 0 && (
            <Animated.View
              entering={FadeInDown.duration(700).delay(150)}
              className="flex-1 items-center justify-center gap-4 mt-16"
            >
              <MysticText variant="gold" size="lg" className="text-center">
                {t('journal.empty_title')}
              </MysticText>
              <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                {t('journal.empty_subtitle')}
              </MysticText>
            </Animated.View>
          )}

          {!isPremium && entries.length >= FREE_LIMITS.journalMaxEntries && (
            <Animated.View
              entering={FadeInDown.duration(500)}
              className="bg-surface border border-border rounded-2xl p-4 mb-4 items-center gap-3"
            >
              <MysticText variant="gold" size="sm" className="text-center">
                {t('journal.limit_reached')}
              </MysticText>
              <TouchableOpacity onPress={() => setPaywallVisible(true)}>
                <MysticText variant="muted" size="xs" className="text-center">
                  {t('paywall.subscribe')} →
                </MysticText>
              </TouchableOpacity>
            </Animated.View>
          )}

          {entries.map((entry, index) => {
            const cardNames = entry.cardIds
              .map((id) => cardRepository.getCardById(id))
              .filter(Boolean)
              .map((card) => t(card!.nameKey))
              .join('  ·  ');

            return (
              <Animated.View
                key={entry.id}
                entering={FadeInDown.duration(500).delay(index * 60)}
                className="bg-surface border border-border rounded-2xl p-4 mb-4"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <MysticText variant="muted" size="xs">
                    {formatDate(entry.createdAt, i18n.language)}
                  </MysticText>
                  <TouchableOpacity
                    onPress={() => handleDelete(entry.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MysticText variant="muted" size="xs">{t('journal.delete')}</MysticText>
                  </TouchableOpacity>
                </View>

                <MysticText variant="gold" size="sm" className="mb-2">
                  {cardNames}
                </MysticText>

                <MysticText variant="body" size="sm" style={{ lineHeight: 20 }}>
                  {entry.note || t('journal.no_note')}
                </MysticText>
              </Animated.View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
      <AdBanner />
    </View>
  );
}

import { View, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';
import { GoldButton } from '@components/ui/GoldButton';
import { CardDeck } from '@components/cards/CardDeck';
import { CardReveal } from '@components/cards/CardReveal';

import { GetDailyCard } from '@domain/usecases/GetDailyCard';
import { GetAIInterpretation } from '@domain/usecases/GetAIInterpretation';
import { cardRepository } from '@data/repositories/CardRepository';
import { aiService } from '@data/remote/aiService';
import { useCardStore } from '@store/useCardStore';
import { useReadingStore } from '@store/useReadingStore';
import type { DrawnCard } from '@domain/entities/Reading';

const getDailyCard = new GetDailyCard(cardRepository);
const getAIInterpretation = new GetAIInterpretation(aiService);

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { dailyCard, setDailyCard, revealedCardIds, revealCard } = useCardStore();
  const { aiInterpretation, setAIInterpretation, isLoadingAI, setIsLoadingAI, clearReading } =
    useReadingStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const card = getDailyCard.execute();
    const isReversed = new Date().getDate() % 3 === 0;
    const drawnCard: DrawnCard = { card, isReversed };
    setDailyCard(drawnCard);
  }, []);

  const isRevealed = dailyCard ? revealedCardIds.has(dailyCard.card.id) : false;

  function handleCardPress() {
    if (dailyCard && !isRevealed) {
      revealCard(dailyCard.card.id);
    }
  }

  async function handleGetInterpretation() {
    if (!dailyCard) return;
    setIsLoadingAI(true);
    setModalVisible(true);
    setError(null);

    try {
      const text = await getAIInterpretation.execute({
        cards: [dailyCard],
        language: i18n.language,
      });
      setAIInterpretation(text);
    } catch {
      setError(t('errors.ai_failed'));
    } finally {
      setIsLoadingAI(false);
    }
  }

  function handleCloseModal() {
    setModalVisible(false);
    clearReading();
  }

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow items-center px-6 py-8"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(600)} className="items-center w-full">
            <MysticText variant="gold" size="sm" className="mb-1 tracking-widest uppercase">
              {t('home.subtitle')}
            </MysticText>
            <MysticText variant="heading" size="xl" className="text-center mb-10">
              {t('home.title')}
            </MysticText>
          </Animated.View>

          {dailyCard ? (
            <Animated.View entering={FadeInDown.duration(700).delay(150)} className="items-center">
              <CardDeck
                drawnCard={dailyCard}
                isRevealed={isRevealed}
                onPress={handleCardPress}
              />

              {isRevealed && (
                <>
                  <CardReveal
                    cardNameKey={dailyCard.card.nameKey}
                    isReversed={dailyCard.isReversed}
                  />
                  <View className="mt-8 w-full items-center">
                    <GoldButton
                      label={t('home.get_interpretation')}
                      onPress={handleGetInterpretation}
                      accessibilityLabel={t('accessibility.get_interpretation')}
                    />
                  </View>
                </>
              )}

              {!isRevealed && (
                <Animated.View entering={FadeInDown.duration(600).delay(300)} className="mt-6">
                  <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                    {t('home.tap_to_reveal')}
                  </MysticText>
                </Animated.View>
              )}
            </Animated.View>
          ) : (
            <ActivityIndicator color="#C9A84C" size="large" />
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
        accessibilityViewIsModal
      >
        <View className="flex-1 bg-background/90 justify-end">
          <View className="bg-surface rounded-t-3xl border-t border-border p-6 max-h-[70%]">
            <MysticText variant="gold" size="lg" className="mb-4 text-center">
              {t('home.interpretation_title')}
            </MysticText>

            {isLoadingAI ? (
              <View className="items-center py-12">
                <ActivityIndicator color="#C9A84C" size="large" />
                <MysticText variant="muted" size="sm" className="mt-4">
                  {t('home.loading_ai')}
                </MysticText>
              </View>
            ) : error ? (
              <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                {error}
              </MysticText>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <MysticText variant="body" size="sm" style={{ lineHeight: 22 }}>
                  {aiInterpretation}
                </MysticText>
              </ScrollView>
            )}

            <View className="mt-6">
              <GoldButton label={t('common.close')} onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

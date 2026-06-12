import { View, ScrollView, Modal, ActivityIndicator, TextInput, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';
import { GoldButton } from '@components/ui/GoldButton';
import { CardDeck } from '@components/cards/CardDeck';
import { CardReveal } from '@components/cards/CardReveal';
import { MoonPhaseWidget } from '@components/ui/MoonPhaseWidget';

import { GetDailyCard } from '@domain/usecases/GetDailyCard';
import { GetAIInterpretation } from '@domain/usecases/GetAIInterpretation';
import { cardRepository } from '@data/repositories/CardRepository';
import { journalRepository } from '@data/repositories/JournalRepository';
import { aiService } from '@data/remote/aiService';
import { generateId } from '@data/local/database';
import { colors } from '@constants/colors';
import { useCardStore } from '@store/useCardStore';
import { useReadingStore } from '@store/useReadingStore';
import { useSubscriptionStore } from '@store/useSubscriptionStore';
import { PaywallModal } from '@components/paywall/PaywallModal';
import { AdBanner } from '@components/ui/AdBanner';
import { MoodPicker } from '@components/ui/MoodPicker';
import type { DrawnCard } from '@domain/entities/Reading';

const getDailyCard = new GetDailyCard(cardRepository);
const getAIInterpretation = new GetAIInterpretation(aiService);

const YES_CARD_IDS = new Set([
  'major_01','major_03','major_06','major_07','major_08','major_10',
  'major_11','major_14','major_17','major_19','major_20','major_21',
  'wands_01','wands_03','wands_06','wands_08','cups_01','cups_02',
  'cups_03','cups_09','cups_10','pentacles_01','pentacles_03',
  'pentacles_06','pentacles_09','pentacles_10',
]);

function getYesNo(drawnCard: DrawnCard): boolean {
  const baseYes = YES_CARD_IDS.has(drawnCard.card.id);
  return drawnCard.isReversed ? !baseYes : baseYes;
}

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { dailyCard, setDailyCard, revealedCardIds, revealCard } = useCardStore();
  const { aiInterpretation, setAIInterpretation, isLoadingAI, setIsLoadingAI, clearReading } =
    useReadingStore();

  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [yesNoCard, setYesNoCard] = useState<DrawnCard | null>(null);
  const [yesNoVisible, setYesNoVisible] = useState(false);

  useEffect(() => {
    const card = getDailyCard.execute();
    const isReversed = new Date().getDate() % 3 === 0;
    const drawnCard: DrawnCard = { card, isReversed };
    setDailyCard(drawnCard);
    setSavedToJournal(false);
  }, []);

  const isRevealed = dailyCard ? revealedCardIds.has(dailyCard.card.id) : false;

  function handleCardPress() {
    if (dailyCard && !isRevealed) {
      revealCard(dailyCard.card.id);
    }
  }

  async function handleGetInterpretation() {
    if (!dailyCard) return;
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
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

  async function handleShare() {
    if (!dailyCard || !aiInterpretation) return;
    const cardName = t(dailyCard.card.nameKey);
    const reversed = dailyCard.isReversed ? ` (${t('card.reversed')})` : '';
    await Share.share({
      message: `✦ TaroCarta — ${cardName}${reversed}\n\n${aiInterpretation}\n\n— TaroCarta`,
    });
  }

  async function handleConfirmSaveToJournal() {
    if (!dailyCard) return;
    await journalRepository.saveEntry({
      id: generateId(),
      readingId: generateId(),
      cardIds: [dailyCard.card.id],
      note: note.trim(),
      mood: mood ?? undefined,
      createdAt: new Date(),
    });
    setNoteModalVisible(false);
    setNote('');
    setMood(null);
    setSavedToJournal(true);
  }

  function handleDrawYesNo() {
    const allCards = cardRepository.getRandomCards(1);
    const card = allCards[0];
    if (!card) return;
    const isReversed = Math.random() < 0.3;
    setYesNoCard({ card, isReversed });
    setYesNoVisible(true);
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
            <MysticText variant="heading" size="xl" className="text-center mb-4">
              {t('home.title')}
            </MysticText>
            <MoonPhaseWidget />
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
                  <View className="mt-8 w-full items-center gap-3">
                    <GoldButton
                      label={t('home.get_interpretation')}
                      onPress={handleGetInterpretation}
                      accessibilityLabel={t('accessibility.get_interpretation')}
                    />
                    <TouchableOpacity
                      onPress={handleDrawYesNo}
                      className="py-2 px-4 rounded-full border border-border"
                    >
                      <MysticText variant="muted" size="sm">{t('home.yesno_button')}</MysticText>
                    </TouchableOpacity>
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

      <AdBanner />

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSuccess={() => setPaywallVisible(false)}
      />

      {/* AI Interpretation modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
        accessibilityViewIsModal
      >
        <View className="flex-1 bg-background/90 justify-end">
          <View className="bg-surface rounded-t-3xl border-t border-border p-6 max-h-[75%]">
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
              <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                <MysticText variant="body" size="sm" style={{ lineHeight: 22 }}>
                  {aiInterpretation}
                </MysticText>
              </ScrollView>
            )}

            {!isLoadingAI && !error && aiInterpretation && (
              <View className="gap-2">
                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-row items-center justify-center gap-2 py-2"
                >
                  <MysticText variant="muted" size="xs">{t('home.share_button')}</MysticText>
                </TouchableOpacity>

                {savedToJournal ? (
                  <MysticText variant="gold" size="sm" className="text-center">
                    {t('journal.saved')}
                  </MysticText>
                ) : (
                  <GoldButton
                    label={t('home.save_journal')}
                    onPress={() => { setModalVisible(false); setNoteModalVisible(true); }}
                  />
                )}
              </View>
            )}

            <View className="mt-3">
              <GoldButton label={t('common.close')} onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Note + mood modal */}
      <Modal
        visible={noteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNoteModalVisible(false)}
        accessibilityViewIsModal
      >
        <View className="flex-1 bg-background/90 justify-end">
          <View className="bg-surface rounded-t-3xl border-t border-border p-6 gap-4">
            <MysticText variant="gold" size="lg" className="text-center">
              {t('home.save_journal')}
            </MysticText>
            <MoodPicker selected={mood} onSelect={setMood} />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t('journal.note_placeholder')}
              placeholderTextColor={colors.textMuted}
              multiline
              style={{
                minHeight: 80,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                color: colors.text,
                fontFamily: 'Lato_400Regular',
                fontSize: 14,
                textAlignVertical: 'top',
              }}
            />
            <GoldButton label={t('journal.save_entry')} onPress={handleConfirmSaveToJournal} />
            <TouchableOpacity
              onPress={() => setNoteModalVisible(false)}
              className="items-center py-2"
            >
              <MysticText variant="muted" size="sm">{t('common.cancel')}</MysticText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Yes / No modal */}
      <Modal
        visible={yesNoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYesNoVisible(false)}
        accessibilityViewIsModal
      >
        <View className="flex-1 bg-background/90 justify-end">
          <View className="bg-surface rounded-t-3xl border-t border-border p-6 gap-4 items-center">
            <MysticText variant="gold" size="lg" className="text-center">
              {t('yesno.title')}
            </MysticText>

            {yesNoCard && (
              <>
                <View className="w-full items-center gap-2">
                  <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                    {t(yesNoCard.card.nameKey)}
                    {yesNoCard.isReversed ? ` — ${t('card.reversed')}` : ''}
                  </MysticText>
                  <View
                    className="rounded-2xl border-2 items-center justify-center"
                    style={{
                      width: 120,
                      height: 180,
                      borderColor: getYesNo(yesNoCard) ? '#4CAF50' : '#9C27B0',
                      backgroundColor: colors.surface,
                    }}
                  >
                    <MysticText
                      variant="gold"
                      size="xxl"
                      style={{ color: getYesNo(yesNoCard) ? '#4CAF50' : '#9C27B0' }}
                    >
                      {getYesNo(yesNoCard) ? t('yesno.yes') : t('yesno.no')}
                    </MysticText>
                    <MysticText variant="muted" size="xs" className="mt-1" style={{ textAlign: 'center' }}>
                      ✦
                    </MysticText>
                  </View>
                </View>
                <TouchableOpacity onPress={handleDrawYesNo} className="py-2">
                  <MysticText variant="muted" size="sm">{t('yesno.draw')}</MysticText>
                </TouchableOpacity>
              </>
            )}

            <GoldButton label={t('common.close')} onPress={() => setYesNoVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

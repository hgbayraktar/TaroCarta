import {
  View,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { MysticText } from '@components/ui/MysticText';
import { GoldButton } from '@components/ui/GoldButton';
import { ThreeCardSpread } from '@components/spread/ThreeCardSpread';
import { SpreadResult } from '@components/spread/SpreadResult';

import { PerformReading } from '@domain/usecases/PerformReading';
import { GetAIInterpretation } from '@domain/usecases/GetAIInterpretation';
import { cardRepository } from '@data/repositories/CardRepository';
import { journalRepository } from '@data/repositories/JournalRepository';
import { aiService } from '@data/remote/aiService';
import { generateId } from '@data/local/database';
import { colors } from '@constants/colors';
import { useSubscriptionStore } from '@store/useSubscriptionStore';
import { PaywallModal } from '@components/paywall/PaywallModal';
import type { Reading } from '@domain/entities/Reading';
import type { JournalEntry } from '@domain/entities/JournalEntry';

const performReading = new PerformReading(cardRepository);
const getAIInterpretation = new GetAIInterpretation(aiService);

type Phase = 'idle' | 'drawing' | 'result';

export default function SpreadsScreen() {
  const { t, i18n } = useTranslation();

  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<Reading | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  function handleBegin() {
    if (!isPremium) {
      setPaywallVisible(true);
      return;
    }
    const newReading = performReading.execute('three_card', question.trim() || undefined);
    setReading(newReading);
    setRevealedIndices(new Set());
    setAiInterpretation(null);
    setError(null);
    setSaved(false);
    setPhase('drawing');
  }

  function handleCardPress(index: number) {
    setRevealedIndices((prev) => new Set([...prev, index]));
  }

  async function handleGetInterpretation() {
    if (!reading) return;
    setIsLoadingAI(true);
    setError(null);
    try {
      const text = await getAIInterpretation.execute({
        cards: reading.cards,
        question: reading.question,
        language: i18n.language,
      });
      setAiInterpretation(text);
      setPhase('result');
    } catch {
      setError(t('errors.ai_failed'));
    } finally {
      setIsLoadingAI(false);
    }
  }

  function handleNewReading() {
    setPhase('idle');
    setQuestion('');
    setReading(null);
    setRevealedIndices(new Set());
    setAiInterpretation(null);
    setSaved(false);
  }

  async function handleConfirmSave() {
    if (!reading) return;
    const entry: JournalEntry = {
      id: generateId(),
      readingId: reading.id,
      cardIds: reading.cards.map((dc) => dc.card.id),
      note: note.trim(),
      createdAt: new Date(),
    };
    await journalRepository.saveEntry(entry);
    setNoteModalVisible(false);
    setNote('');
    setSaved(true);
  }

  const allRevealed = revealedIndices.size === 3;

  return (
    <View className="flex-1 bg-background">
      <AnimatedBackground />
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow px-6 py-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(600)} className="items-center w-full mb-8">
            <MysticText variant="gold" size="sm" className="mb-1 tracking-widest uppercase">
              {t('tabs.spreads')}
            </MysticText>
            <MysticText variant="heading" size="xl" className="text-center">
              {t('spread.title')}
            </MysticText>
          </Animated.View>

          {phase === 'idle' && (
            <Animated.View
              entering={FadeInDown.duration(700).delay(150)}
              className="items-center w-full gap-6"
            >
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder={t('spread.question_placeholder')}
                placeholderTextColor={colors.textMuted}
                multiline
                style={{
                  width: '100%',
                  minHeight: 80,
                  backgroundColor: colors.surface,
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
              <GoldButton label={t('spread.begin')} onPress={handleBegin} />
            </Animated.View>
          )}

          {phase === 'drawing' && reading && (
            <Animated.View
              entering={FadeInDown.duration(700)}
              className="items-center w-full gap-6"
            >
              {!allRevealed && (
                <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                  {t('spread.tap_to_reveal')}
                </MysticText>
              )}

              <ThreeCardSpread
                cards={reading.cards as [any, any, any]}
                revealedIndices={revealedIndices}
                onCardPress={handleCardPress}
              />

              {allRevealed && (
                <View className="w-full items-center gap-4 mt-4">
                  {isLoadingAI ? (
                    <View className="items-center gap-3">
                      <ActivityIndicator color={colors.gold} size="large" />
                      <MysticText variant="muted" size="sm">
                        {t('spread.loading_ai')}
                      </MysticText>
                    </View>
                  ) : error ? (
                    <MysticText variant="muted" size="sm" style={{ textAlign: 'center' }}>
                      {error}
                    </MysticText>
                  ) : (
                    <GoldButton
                      label={t('spread.get_interpretation')}
                      onPress={handleGetInterpretation}
                    />
                  )}
                </View>
              )}
            </Animated.View>
          )}

          {phase === 'result' && reading && aiInterpretation && (
            <Animated.View entering={FadeInDown.duration(700)} className="w-full gap-4">
              <MysticText variant="gold" size="lg" className="text-center mb-2">
                {t('spread.interpretation_title')}
              </MysticText>

              <View
                className="bg-surface rounded-2xl border border-border overflow-hidden"
                style={{ minHeight: 200 }}
              >
                <SpreadResult cards={reading.cards} interpretation={aiInterpretation} />
              </View>

              <View className="gap-3 mt-2">
                {!saved ? (
                  <GoldButton
                    label={t('spread.save_journal')}
                    onPress={() => setNoteModalVisible(true)}
                  />
                ) : (
                  <MysticText variant="gold" size="sm" className="text-center">
                    {t('journal.saved')}
                  </MysticText>
                )}
                <GoldButton label={t('spread.new_reading')} onPress={handleNewReading} />
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onSuccess={() => setPaywallVisible(false)}
      />

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
              {t('spread.save_journal')}
            </MysticText>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t('journal.note_placeholder')}
              placeholderTextColor={colors.textMuted}
              multiline
              style={{
                minHeight: 100,
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
            <GoldButton label={t('journal.save_entry')} onPress={handleConfirmSave} />
            <TouchableOpacity
              onPress={() => setNoteModalVisible(false)}
              className="items-center py-2"
            >
              <MysticText variant="muted" size="sm">{t('common.cancel')}</MysticText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

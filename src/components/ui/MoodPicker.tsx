import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MysticText } from './MysticText';

const MOODS = [
  { emoji: '😊', key: 'great' },
  { emoji: '🙂', key: 'good' },
  { emoji: '😐', key: 'neutral' },
  { emoji: '😔', key: 'low' },
  { emoji: '😤', key: 'stormy' },
] as const;

interface MoodPickerProps {
  selected: string | null;
  onSelect: (emoji: string) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <MysticText variant="muted" size="xs" className="text-center">
        {t('mood.label')}
      </MysticText>
      <View className="flex-row justify-center gap-3">
        {MOODS.map(({ emoji, key }) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(emoji)}
            className={`items-center p-2 rounded-full ${selected === emoji ? 'bg-gold/20 border border-gold' : 'border border-transparent'}`}
            accessibilityLabel={t(`mood.${key}`)}
          >
            <MysticText variant="body" size="lg">{emoji}</MysticText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

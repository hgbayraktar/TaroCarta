import { Pressable, Text, ActivityIndicator, Animated } from 'react-native';
import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GoldButton({ label, onPress, loading = false, disabled = false, accessibilityLabel }: GoldButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <AnimatedPressable
      style={{ transform: [{ scale }] }}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      className="items-center justify-center rounded-xl bg-gold px-8 py-4 min-h-[52px] min-w-[48px]"
    >
      {loading ? (
        <ActivityIndicator color="#0D1117" />
      ) : (
        <Text className="font-body-bold text-md text-background">
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

import { Pressable, Text, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface GoldButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Primary CTA button with gold gradient and spring press animation. */
export function GoldButton({ label, onPress, loading = false, disabled = false, accessibilityLabel }: GoldButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    scale.value = withSpring(0.95);
  }

  function handlePressOut() {
    scale.value = withSpring(1);
  }

  async function handlePress() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }

  return (
    <AnimatedPressable
      style={animatedStyle}
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

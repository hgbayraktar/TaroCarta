import { Pressable, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MysticText } from '../ui/MysticText';
import { colors } from '@constants/colors';

const W = 72;
const H = 112;

interface SmallCardProps {
  isRevealed: boolean;
  isReversed: boolean;
  cardName?: string;
  positionLabel: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export function SmallCard({ isRevealed, isReversed, cardName, positionLabel, onPress, accessibilityLabel }: SmallCardProps) {
  const rotation = useSharedValue(isRevealed ? 1 : 0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${interpolate(rotation.value, [0, 1], [180, 360])}deg` }],
    opacity: rotation.value > 0.5 ? 1 : 0,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateY: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` }],
    opacity: rotation.value < 0.5 ? 1 : 0,
  }));

  async function handlePress() {
    if (!isRevealed) {
      rotation.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.cubic) });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  return (
    <View className="items-center gap-1">
      <MysticText variant="muted" size="xs" style={{ textAlign: 'center', maxWidth: W + 8 }}>
        {positionLabel}
      </MysticText>
      <Pressable
        onPress={handlePress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={styles.container}
      >
        <Animated.View style={[styles.face, backStyle, styles.back]}>
          <MysticText variant="gold" size="sm">✦</MysticText>
        </Animated.View>
        <Animated.View style={[styles.face, styles.absolute, frontStyle, styles.front]}>
          <View style={[styles.inner, isReversed && { transform: [{ rotate: '180deg' }] }]}>
            <MysticText variant="gold" size="xs" style={{ textAlign: 'center' }}>
              {cardName ?? ''}
            </MysticText>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: W, height: H },
  face: {
    width: W,
    height: H,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  back: {},
  front: {},
  absolute: { position: 'absolute', top: 0, left: 0 },
  inner: { padding: 6, flex: 1, alignItems: 'center', justifyContent: 'center' },
});

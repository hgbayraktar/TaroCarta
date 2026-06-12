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

interface TarotCardProps {
  cardId: string;
  isRevealed: boolean;
  isReversed: boolean;
  cardName?: string;
  onPress: () => void;
  accessibilityLabel: string;
}

const CARD_WIDTH = 200;
const CARD_HEIGHT = 340;

/** SVG-style geometric back face pattern */
function CardBack() {
  return (
    <View style={styles.face}>
      <View style={styles.backOuter}>
        <View style={styles.backInner}>
          <View style={styles.backDiamond} />
          <MysticText variant="gold" size="xxl" style={styles.backGlyph}>✦</MysticText>
        </View>
      </View>
    </View>
  );
}

/** Front face with gradient placeholder */
function CardFront({ cardName, isReversed }: { cardName?: string; isReversed: boolean }) {
  return (
    <View style={[styles.face, { transform: [{ rotateZ: isReversed ? '180deg' : '0deg' }] }]}>
      <View style={styles.frontGradient}>
        <View style={styles.frontTopBar} />
        <View style={styles.frontCenter}>
          <MysticText variant="gold" size="xxl">☽ ✦ ☾</MysticText>
        </View>
        <View style={styles.frontBottomBar}>
          {cardName ? (
            <MysticText variant="heading" size="sm" style={{ textAlign: 'center', color: colors.gold }}>
              {cardName}
            </MysticText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/**
 * Flippable tarot card with Y-axis 180° Reanimated 3 animation.
 * Triggers haptic feedback on reveal.
 */
export function TarotCard({
  cardId,
  isRevealed,
  isReversed,
  cardName,
  onPress,
  accessibilityLabel,
}: TarotCardProps) {
  const rotation = useSharedValue(isRevealed ? 1 : 0);

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value > 0.5 ? 1 : 0,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: rotation.value < 0.5 ? 1 : 0,
    };
  });

  async function handlePress() {
    if (!isRevealed) {
      rotation.value = withTiming(1, { duration: 600, easing: Easing.inOut(Easing.cubic) });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ expanded: isRevealed }}
      style={styles.container}
    >
      <Animated.View style={[styles.cardFace, backStyle]}>
        <CardBack />
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardFaceAbsolute, frontStyle]}>
        <CardFront cardName={cardName} isReversed={isReversed} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardFace: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardFaceAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  face: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backOuter: {
    width: 160,
    height: 280,
    borderWidth: 1,
    borderColor: colors.gold + '60',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backInner: {
    width: 130,
    height: 240,
    borderWidth: 1,
    borderColor: colors.purple + '80',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backDiamond: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.gold + '40',
    transform: [{ rotate: '45deg' }],
  },
  backGlyph: {
    opacity: 0.8,
  },
  frontGradient: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    justifyContent: 'space-between',
  },
  frontTopBar: {
    height: 2,
    backgroundColor: colors.gold + '60',
    borderRadius: 1,
  },
  frontCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  frontBottomBar: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.gold + '40',
    alignItems: 'center',
  },
});

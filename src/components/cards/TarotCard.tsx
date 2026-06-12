import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
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

export function TarotCard({
  cardId,
  isRevealed,
  isReversed,
  cardName,
  onPress,
  accessibilityLabel,
}: TarotCardProps) {
  const rotation = useRef(new Animated.Value(isRevealed ? 1 : 0)).current;

  const backRotateY = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const frontRotateY = rotation.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const backOpacity = rotation.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const frontOpacity = rotation.interpolate({ inputRange: [0, 0.49, 0.5, 1], outputRange: [0, 0, 1, 1] });

  async function handlePress() {
    if (!isRevealed) {
      Animated.timing(rotation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
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
      <Animated.View
        style={[
          styles.cardFace,
          { transform: [{ perspective: 1000 }, { rotateY: backRotateY }], opacity: backOpacity },
        ]}
      >
        <CardBack />
      </Animated.View>
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFaceAbsolute,
          { transform: [{ perspective: 1000 }, { rotateY: frontRotateY }], opacity: frontOpacity },
        ]}
      >
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

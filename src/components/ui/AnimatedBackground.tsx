import { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 60;

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const STARS: Star[] = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 2.5 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 3000,
}));

function StarParticle({ star }: { star: Star }) {
  const opacity = useSharedValue(star.opacity);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(star.opacity * 0.2, {
        duration: 2000 + star.delay,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: '#F0E6D3',
        },
      ]}
    />
  );
}

/** Full-screen dark background with twinkling star particle animation. */
export function AnimatedBackground() {
  return (
    <View className="absolute inset-0 bg-background" pointerEvents="none">
      {STARS.map((star, i) => (
        <StarParticle key={i} star={star} />
      ))}
    </View>
  );
}

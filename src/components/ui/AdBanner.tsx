/**
 * AdBanner placeholder.
 *
 * To activate real ads:
 *   1. npx expo install react-native-google-mobile-ads
 *   2. Add to app.json plugins: ["react-native-google-mobile-ads", {...}]
 *   3. Replace this component with <BannerAd> from that package
 *   4. Add your Ad Unit IDs to .env:
 *        EXPO_PUBLIC_ADMOB_IOS_BANNER=ca-app-pub-xxx/yyy
 *        EXPO_PUBLIC_ADMOB_ANDROID_BANNER=ca-app-pub-xxx/zzz
 */

import { View } from 'react-native';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { MysticText } from './MysticText';
import { colors } from '../../constants/colors';

export function AdBanner() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);

  if (isPremium) return null;

  return (
    <View
      style={{
        height: 50,
        backgroundColor: colors.surfaceAlt,
        borderTopWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MysticText variant="muted" size="xs">
        Advertisement
      </MysticText>
    </View>
  );
}

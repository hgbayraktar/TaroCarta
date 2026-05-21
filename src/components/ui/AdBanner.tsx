import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { colors } from '../../constants/colors';

// @ts-ignore — installed at EAS build time
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : (process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ?? TestIds.BANNER);

let adsInitialized = false;

export function AdBanner() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const initRef = useRef(false);

  useEffect(() => {
    if (!adsInitialized && !initRef.current) {
      initRef.current = true;
      adsInitialized = true;
      setTimeout(() => mobileAds().initialize(), 2000);
    }
  }, []);

  if (isPremium) return null;

  return (
    <View
      style={{
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceAlt,
      }}
    >
      <BannerAd unitId={BANNER_ID} size={BannerAdSize.BANNER} />
    </View>
  );
}

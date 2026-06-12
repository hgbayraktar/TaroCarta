import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { colors } from '../../constants/colors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BannerAdComp: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BannerAdSizeConst: any = null;
let bannerUnitId: string | null = null;
let initPromise: Promise<boolean> | null = null;

function loadAdMob(): Promise<boolean> {
  if (!initPromise) {
    initPromise = new Promise<boolean>((resolve) => {
      setTimeout(async () => {
        try {
          // @ts-ignore — installed at EAS build time
          const mod = await import('react-native-google-mobile-ads');
          await mod.default().initialize();
          BannerAdComp = mod.BannerAd;
          BannerAdSizeConst = mod.BannerAdSize;
          bannerUnitId = __DEV__
            ? mod.TestIds.BANNER
            : (process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ?? mod.TestIds.BANNER);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 2000);
    });
  }
  return initPromise;
}

export function AdBanner() {
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    if (isPremium) return;
    loadAdMob().then((ok) => {
      if (ok) setAdsReady(true);
    });
  }, [isPremium]);

  if (isPremium || !adsReady || !BannerAdComp) return null;

  const BannerAd = BannerAdComp;
  return (
    <View
      style={{
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceAlt,
      }}
    >
      <BannerAd unitId={bannerUnitId} size={BannerAdSizeConst.BANNER} />
    </View>
  );
}

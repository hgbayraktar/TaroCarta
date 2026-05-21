import '../../global.css';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
// @ts-ignore
import mobileAds from 'react-native-google-mobile-ads';
import '../i18n';
import { initPurchases, syncCustomerInfo } from '@services/purchaseService';
import { isReminderEnabled, scheduleDailyReminder } from '@services/notificationService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      mobileAds().initialize();
      initPurchases().then(() => syncCustomerInfo());
      if (Platform.OS === 'ios') {
        requestTrackingPermissionsAsync();
      }
      isReminderEnabled().then((enabled) => {
        if (enabled) {
          scheduleDailyReminder('Your Daily Card Awaits', 'Open TaroCarta for your daily tarot reading');
        }
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

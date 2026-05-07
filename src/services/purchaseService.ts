/**
 * Purchase service — wraps RevenueCat.
 *
 * Setup required before production:
 *   1. npx expo install react-native-purchases
 *   2. Add RevenueCat API keys to .env:
 *        EXPO_PUBLIC_RC_IOS_KEY=appl_xxxxx
 *        EXPO_PUBLIC_RC_ANDROID_KEY=goog_xxxxx
 *   3. Create products in App Store Connect + Google Play Console
 *      with the IDs defined in src/constants/plans.ts
 *   4. Wire up products in RevenueCat dashboard
 */

import { useSubscriptionStore } from '../store/useSubscriptionStore';

let Purchases: any = null;

async function getRC() {
  if (Purchases) return Purchases;
  try {
    // Dynamic import so the app doesn't crash if the package isn't installed yet
    const mod = await import('react-native-purchases');
    Purchases = mod.default;
    return Purchases;
  } catch {
    return null;
  }
}

export async function initPurchases() {
  const RC = await getRC();
  if (!RC) return;

  const iosKey = process.env.EXPO_PUBLIC_RC_IOS_KEY;
  const androidKey = process.env.EXPO_PUBLIC_RC_ANDROID_KEY;

  const { Platform } = await import('react-native');
  const apiKey = Platform.OS === 'ios' ? iosKey : androidKey;
  if (!apiKey) return;

  await RC.configure({ apiKey });
  await syncCustomerInfo();
}

export async function syncCustomerInfo() {
  const RC = await getRC();
  if (!RC) return;

  try {
    const info = await RC.getCustomerInfo();
    const active = info.activeSubscriptions as string[];
    if (active.length > 0) {
      const planId = active[0]!;
      const expiry = info.allExpirationDates[planId];
      const expiresAt = expiry ? new Date(expiry) : new Date(Date.now() + 365 * 24 * 3600 * 1000);
      useSubscriptionStore.getState().setPremium(planId, expiresAt);
    } else {
      useSubscriptionStore.getState().clearPremium();
    }
  } catch {
    // network error — keep existing state
  }
}

export async function purchasePlan(revenueCatId: string): Promise<boolean> {
  const RC = await getRC();
  if (!RC) {
    // DEV MODE: simulate a successful purchase for testing UI
    const store = useSubscriptionStore.getState();
    store.setPremium(revenueCatId, new Date(Date.now() + 30 * 24 * 3600 * 1000));
    return true;
  }

  try {
    const offerings = await RC.getOfferings();
    const pkg = offerings.current?.availablePackages.find(
      (p: any) => p.product.identifier === revenueCatId
    );
    if (!pkg) return false;

    const { customerInfo } = await RC.purchasePackage(pkg);
    const active = customerInfo.activeSubscriptions as string[];
    if (active.includes(revenueCatId)) {
      useSubscriptionStore.getState().setPremium(revenueCatId, new Date(Date.now() + 30 * 24 * 3600 * 1000));
      return true;
    }
    return false;
  } catch (e: any) {
    if (e?.userCancelled) return false;
    throw e;
  }
}

export async function restorePurchases(): Promise<boolean> {
  const RC = await getRC();
  if (!RC) return false;

  try {
    const info = await RC.restorePurchases();
    const active = info.activeSubscriptions as string[];
    if (active.length > 0) {
      useSubscriptionStore.getState().setPremium(active[0]!, new Date(Date.now() + 365 * 24 * 3600 * 1000));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

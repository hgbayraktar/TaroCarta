import { useSubscriptionStore } from '../store/useSubscriptionStore';

const ENTITLEMENT_ID = 'premium';

let RC: any = null;

async function getRC() {
  if (RC) return RC;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — installed at EAS build time
    const mod = await import('react-native-purchases');
    RC = mod.default;
    return RC;
  } catch {
    return null;
  }
}

export async function initPurchases() {
  const Purchases = await getRC();
  if (!Purchases) return;

  const { Platform } = await import('react-native');
  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_RC_IOS_KEY
      : process.env.EXPO_PUBLIC_RC_ANDROID_KEY;

  if (!apiKey) return;

  await Purchases.configure({ apiKey });
}

export async function syncCustomerInfo() {
  const Purchases = await getRC();
  if (!Purchases) return;

  try {
    const info = await Purchases.getCustomerInfo();
    const isActive = !!info.entitlements.active[ENTITLEMENT_ID];
    if (isActive) {
      const entitlement = info.entitlements.active[ENTITLEMENT_ID];
      const planId = entitlement?.productIdentifier ?? '';
      const expiry = entitlement?.expirationDate
        ? new Date(entitlement.expirationDate)
        : new Date(Date.now() + 365 * 24 * 3600 * 1000);
      useSubscriptionStore.getState().setPremium(planId, expiry);
    } else {
      useSubscriptionStore.getState().clearPremium();
    }
  } catch {
    // network error — keep existing state
  }
}

export async function purchasePlan(revenueCatId: string): Promise<boolean> {
  const Purchases = await getRC();
  if (!Purchases) {
    // DEV MODE: simulate purchase
    useSubscriptionStore
      .getState()
      .setPremium(revenueCatId, new Date(Date.now() + 30 * 24 * 3600 * 1000));
    return true;
  }

  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages.find(
      (p: any) => p.product.identifier === revenueCatId
    );
    if (!pkg) return false;

    const { customerInfo } = await Purchases.purchasePackage(pkg);

    // Check entitlement — not activeSubscriptions (ZZPBox lesson: this caused 2.1a rejection)
    const isActive = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (isActive) {
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      const planId = entitlement?.productIdentifier ?? revenueCatId;
      const expiry = entitlement?.expirationDate
        ? new Date(entitlement.expirationDate)
        : new Date(Date.now() + 30 * 24 * 3600 * 1000);
      useSubscriptionStore.getState().setPremium(planId, expiry);
      return true;
    }
    return false;
  } catch (e: any) {
    if (e?.userCancelled) return false;
    throw e;
  }
}

export async function restorePurchases(): Promise<boolean> {
  const Purchases = await getRC();
  if (!Purchases) return false;

  try {
    const info = await Purchases.restorePurchases();
    const isActive = !!info.entitlements.active[ENTITLEMENT_ID];
    if (isActive) {
      const entitlement = info.entitlements.active[ENTITLEMENT_ID];
      const planId = entitlement?.productIdentifier ?? '';
      const expiry = entitlement?.expirationDate
        ? new Date(entitlement.expirationDate)
        : new Date(Date.now() + 365 * 24 * 3600 * 1000);
      useSubscriptionStore.getState().setPremium(planId, expiry);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

import { create } from 'zustand';

interface SubscriptionStore {
  isPremium: boolean;
  activePlanId: string | null;
  expiresAt: Date | null;
  setPremium: (planId: string, expiresAt: Date) => void;
  clearPremium: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  isPremium: false,
  activePlanId: null,
  expiresAt: null,
  setPremium: (planId, expiresAt) => set({ isPremium: true, activePlanId: planId, expiresAt }),
  clearPremium: () => set({ isPremium: false, activePlanId: null, expiresAt: null }),
}));

export interface Plan {
  id: 'monthly' | 'quarterly' | 'annual';
  revenueCatId: string;
  priceUSD: string;
  period: string;
  perMonthUSD: string;
  savingsPct?: number;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    revenueCatId: 'tarocarta_monthly',
    priceUSD: '$4.99',
    period: 'month',
    perMonthUSD: '$4.99',
  },
  {
    id: 'quarterly',
    revenueCatId: 'tarocarta_quarterly',
    priceUSD: '$9.99',
    period: '3 months',
    perMonthUSD: '$3.33',
    savingsPct: 33,
  },
  {
    id: 'annual',
    revenueCatId: 'tarocarta_annual',
    priceUSD: '$19.99',
    period: 'year',
    perMonthUSD: '$1.67',
    savingsPct: 67,
    highlighted: true,
  },
];

export const FREE_LIMITS = {
  journalMaxEntries: 3,
  aiInterpretationsPerDay: 0,
  spreadsEnabled: false,
};

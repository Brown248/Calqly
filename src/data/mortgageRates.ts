export interface MortgageRatePoint {
  date: string; // YYYY-MM
  averageRate: number;
  banks: {
    name: string;
    rate: number;
  }[];
}

export const MORTGAGE_RATE_INDEX: MortgageRatePoint[] = [
  {
    date: '2024-10',
    averageRate: 6.45,
    banks: [
      { name: 'KBank', rate: 6.50 },
      { name: 'SCB', rate: 6.45 },
      { name: 'BBL', rate: 6.40 },
    ]
  },
  {
    date: '2024-11',
    averageRate: 6.35,
    banks: [
      { name: 'KBank', rate: 6.40 },
      { name: 'SCB', rate: 6.35 },
      { name: 'BBL', rate: 6.30 },
    ]
  },
  {
    date: '2024-12',
    averageRate: 6.30,
    banks: [
      { name: 'KBank', rate: 6.30 },
      { name: 'SCB', rate: 6.30 },
      { name: 'BBL', rate: 6.30 },
    ]
  },
  {
    date: '2025-01',
    averageRate: 6.25,
    banks: [
      { name: 'KBank', rate: 6.25 },
      { name: 'SCB', rate: 6.25 },
      { name: 'BBL', rate: 6.25 },
    ]
  },
  {
    date: '2025-02',
    averageRate: 6.15,
    banks: [
      { name: 'KBank', rate: 6.20 },
      { name: 'SCB', rate: 6.15 },
      { name: 'BBL', rate: 6.10 },
    ]
  },
  {
    date: '2025-03',
    averageRate: 6.10,
    banks: [
      { name: 'KBank', rate: 6.10 },
      { name: 'SCB', rate: 6.10 },
      { name: 'BBL', rate: 6.10 },
    ]
  },
  {
    date: '2025-04',
    averageRate: 6.05,
    banks: [
      { name: 'KBank', rate: 6.10 },
      { name: 'SCB', rate: 6.05 },
      { name: 'BBL', rate: 6.00 },
    ]
  }
];

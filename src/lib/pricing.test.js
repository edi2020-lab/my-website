import { describe, test, expect } from 'vitest';
import { getPerPersonRate, calculateTotal, getAllTiers, getTierLabel } from './pricing.js';

const BASE = 50;

// ─── getPerPersonRate ─────────────────────────────────────────────────────────
test('flat base for 1-3 pax', () => {
  expect(getPerPersonRate(BASE, 1)).toBeCloseTo(50,    2);
  expect(getPerPersonRate(BASE, 2)).toBeCloseTo(25,    2);
  expect(getPerPersonRate(BASE, 3)).toBeCloseTo(16.67, 2);
});

test('10% off for 4-5 pax', () => {
  const expected = (BASE / 3) * 0.90; // ≈ 15.00
  expect(getPerPersonRate(BASE, 4)).toBeCloseTo(expected, 4);
  expect(getPerPersonRate(BASE, 5)).toBeCloseTo(expected, 4);
});

test('12.5% off for 6+ pax', () => {
  const expected = (BASE / 3) * 0.875; // ≈ 14.583
  expect(getPerPersonRate(BASE, 6)).toBeCloseTo(expected, 4);
  expect(getPerPersonRate(BASE, 10)).toBeCloseTo(expected, 4);
});

// ─── calculateTotal ───────────────────────────────────────────────────────────
test('totals with no tax — 2 adults', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 2, children: 0 });
  expect(r.total).toBeCloseTo(50,    2);  // flat base
  expect(r.subtotal).toBeCloseTo(50, 2);
});

test('totals with no tax — 4 adults', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 4, children: 0 });
  expect(r.total).toBeCloseTo(60, 2);     // 4 × 15.00
});

test('totals with no tax — 6 adults', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 6, children: 0 });
  expect(r.total).toBeCloseTo(87.50, 2);  // 6 × 14.583
});

test('children priced at 70% of adult tier rate', () => {
  // 0 adults + 4 children → payingPax = 4 → tier 10% off
  const r = calculateTotal({ basePrice: BASE, adults: 0, children: 4 });
  const adultRate = (BASE / 3) * 0.90;
  expect(r.childRate).toBeCloseTo(adultRate * 0.70, 4);
});

test('infants do not count toward tier', () => {
  // 2 adults + 0 children + 5 infants → payingPax = 2 → flat base
  const r = calculateTotal({ basePrice: BASE, adults: 2, children: 0, infants: 5 });
  expect(r.adultRate).toBeCloseTo(BASE / 2, 4);  // $25
  expect(r.total).toBeCloseTo(50, 2);
});

test('no tax field in result', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 4, children: 0 });
  expect(r.tax).toBeUndefined();
  expect(r.total).toBe(r.subtotal);
});

test('savingsPerPerson is 0 for 1-3 pax', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 3, children: 0 });
  expect(r.savingsPerPerson).toBe(0);
});

test('savingsPerPerson > 0 for 4+ pax', () => {
  const r = calculateTotal({ basePrice: BASE, adults: 4, children: 0 });
  expect(r.savingsPerPerson).toBeGreaterThan(0);
});

// ─── getTierLabel ─────────────────────────────────────────────────────────────
describe('getTierLabel', () => {
  test('1-3', () => expect(getTierLabel(3)).toBe('Flat base rate'));
  test('4-5', () => expect(getTierLabel(5)).toBe('Group discount — 10% off'));
  test('6+',  () => expect(getTierLabel(6)).toBe('Group discount — 12.5% off'));
});

// ─── getAllTiers ──────────────────────────────────────────────────────────────
describe('getAllTiers', () => {
  test('returns 9 rows', () => expect(getAllTiers(BASE)).toHaveLength(9));
  test('row pax=3 total = BASE_PRICE', () => {
    const row = getAllTiers(BASE).find(r => r.travelers === 3);
    expect(row.total).toBeCloseTo(BASE, 4);
  });
  test('row pax=4 total ≈ 60', () => {
    const row = getAllTiers(BASE).find(r => r.travelers === 4);
    expect(row.total).toBeCloseTo(60, 2);
  });
  test('row pax=6 total ≈ 87.50', () => {
    const row = getAllTiers(BASE).find(r => r.travelers === 6);
    expect(row.total).toBeCloseTo(87.50, 2);
  });
});

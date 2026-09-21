// ─── Pricing Constants ────────────────────────────────────────────────────────
export const DEFAULT_BASE_PRICE  = 50;   // flat total for 1-3 travelers
export const CHILD_RATE_FACTOR   = 0.70;

/**
 * Per-person adult rate for a given group size.
 *
 * n ≤ 3 → basePrice / n        (flat total = basePrice regardless of headcount)
 * n 4–5 → (basePrice/3) × 0.90  (10% off base rate)
 * n 6+  → (basePrice/3) × 0.875 (12.5% off base rate)
 *
 * Infants do NOT count toward totalPax.
 */
export function getPerPersonRate(basePrice, totalPax) {
  const baseRate = basePrice / 3;
  if (totalPax <= 3) return basePrice / totalPax;
  if (totalPax <= 5) return baseRate * 0.90;
  return baseRate * 0.875;
}

/**
 * Human-readable tier label.
 */
export function getTierLabel(totalPax) {
  if (totalPax <= 3) return 'Flat base rate';
  if (totalPax <= 5) return 'Group discount — 10% off';
  return 'Group discount — 12.5% off';
}

/**
 * Full booking total. No tax.
 *
 * @param {{ basePrice, adults, children, infants }} args
 * @returns {{
 *   adultRate, childRate,
 *   adultSubtotal, childSubtotal,
 *   subtotal, total,
 *   effectivePerPerson, savingsPerPerson, savingsTotal,
 *   tierLabel, payingPax, isMinBooking
 * }}
 */
export function calculateTotal({ basePrice, adults, children, infants = 0 }) {
  const payingPax = adults + children;       // infants excluded
  const adultRate = getPerPersonRate(basePrice, payingPax);
  const childRate = adultRate * CHILD_RATE_FACTOR;

  const adultSubtotal = adults   * adultRate;
  const childSubtotal = children * childRate;
  const subtotal      = adultSubtotal + childSubtotal;

  const baseRate        = basePrice / 3;
  const savingsPerPerson = payingPax > 3 ? baseRate - adultRate : 0;

  return {
    adultRate,
    childRate,
    adultSubtotal,
    childSubtotal,
    subtotal,
    total: subtotal,          // no tax
    effectivePerPerson: payingPax > 0 ? subtotal / payingPax : 0,
    savingsPerPerson,
    savingsTotal: savingsPerPerson * payingPax,
    tierLabel: getTierLabel(payingPax),
    payingPax,
    isMinBooking: payingPax <= 2,
  };
}

/**
 * All pricing tiers for the tiers table.
 * Rows: 1, 2, 3, 4, 5, 6, 7, 8, 10.
 */
export function getAllTiers(basePrice) {
  return [1, 2, 3, 4, 5, 6, 7, 8, 10].map(n => {
    const rate = getPerPersonRate(basePrice, n);
    return {
      travelers:    n,
      ratePerPerson: rate,
      total:        n <= 3 ? basePrice : rate * n,
      tier:         getTierLabel(n),
    };
  });
}

/**
 * Format a number as USD currency string.
 */
export function fmt(amount) {
  return new Intl.NumberFormat('en-US', {
    style:               'currency',
    currency:            'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

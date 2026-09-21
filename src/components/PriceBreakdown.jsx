import { useMemo, useRef, useEffect } from 'react';
import { calculateTotal, fmt } from '../lib/pricing.js';
import PricingTiersTable from './PricingTiersTable.jsx';

export default function PriceBreakdown({ tour, adults, children, infants }) {
  const result = useMemo(
    () => calculateTotal({ basePrice: tour.basePrice, adults, children, infants }),
    [tour.basePrice, adults, children, infants]
  );

  // Animate total on change
  const totalRef  = useRef(null);
  const prevTotal = useRef(null);
  useEffect(() => {
    if (totalRef.current && prevTotal.current !== result.total) {
      totalRef.current.classList.remove('animate-price');
      void totalRef.current.offsetWidth;
      totalRef.current.classList.add('animate-price');
      prevTotal.current = result.total;
    }
  }, [result.total]);

  const { payingPax } = result;
  const baseRate = tour.basePrice / 3;

  // Badge copy
  const badgeCopy =
    payingPax >= 6 ? 'Group discount applied — 12.5% off' :
    payingPax >= 4 ? 'Group discount applied — 10% off'   : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-4">
        <h3 className="font-bold text-white text-base leading-tight">{tour.name}</h3>
        <p className="text-teal-100 text-sm mt-0.5">{tour.duration} · {tour.category}</p>
      </div>

      <div className="p-5">

        {/* Group discount badge */}
        {badgeCopy && (
          <div className="mb-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full px-3 py-1.5">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {badgeCopy}
          </div>
        )}

        {/* Min-booking note */}
        {result.isMinBooking && (
          <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
            ℹ️ Minimum-booking price applies — <strong>{fmt(tour.basePrice)} flat</strong> for up to 3 travelers. No extra charge for adding a 2nd or 3rd traveler.
          </div>
        )}

        {/* Line items — no tax */}
        <div className="space-y-1 text-sm">
          <LineItem label={`Adults (${adults} × ${fmt(result.adultRate)})`}   amount={result.adultSubtotal} />
          <LineItem label={`Children (${children} × ${fmt(result.childRate)})`} amount={result.childSubtotal} />
          <LineItem label={`Infants (${infants} × ${fmt(0)})`}                amount={0} muted />

          <div className="border-t-2 border-gray-900 my-3" />

          {/* TOTAL */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 text-base">TOTAL</span>
            <span
              ref={totalRef}
              className="font-bold text-gray-900 text-2xl transition-all"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {fmt(result.total)}
            </span>
          </div>
        </div>

        {/* Per-person info */}
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-sm">
          <InfoRow label="Effective rate per person" value={fmt(result.effectivePerPerson)} />
          <InfoRow label="Base rate (3-pax tier)"    value={fmt(baseRate)} />
          {result.savingsPerPerson > 0 && (
            <InfoRow label="You save per person" value={`−${fmt(result.savingsPerPerson)}`} highlight />
          )}
          {result.savingsTotal > 0 && (
            <InfoRow label="Total group savings" value={`−${fmt(result.savingsTotal)}`} highlight />
          )}
          <p className="text-xs text-gray-400 mt-1 pt-1">
            Tier: <span className="font-medium text-gray-500">{result.tierLabel}</span>
          </p>
        </div>

        {/* Tiers table */}
        <PricingTiersTable basePrice={tour.basePrice} currentPax={payingPax} />
      </div>
    </div>
  );
}

function LineItem({ label, amount, muted }) {
  return (
    <div className={`flex justify-between items-center py-0.5 ${muted ? 'text-gray-400' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(amount)}</span>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className={`flex justify-between items-center ${highlight ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

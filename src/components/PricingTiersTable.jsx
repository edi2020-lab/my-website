import { useState } from 'react';
import { getAllTiers, fmt } from '../lib/pricing.js';

export default function PricingTiersTable({ basePrice, currentPax }) {
  const [open, setOpen] = useState(false);
  const tiers = getAllTiers(basePrice);

  // Determine which row label is active
  function isActive(tier) {
    if (currentPax >= 6) return tier.travelers >= 6 && tier.travelers === tiers.filter(t => t.travelers >= 6)[0]?.travelers;
    if (currentPax >= 4) return tier.travelers >= 4 && tier.travelers <= 5 && tier.travelers === 4;
    // 1-3: highlight the specific row
    return tier.travelers === Math.min(currentPax, 3);
  }

  // Simpler: just highlight the exact row that matches, or closest tier
  function rowActive(tier) {
    const n = tier.travelers;
    if (currentPax <= 3) return n === currentPax;
    if (currentPax <= 5) return n === currentPax;
    // 6+: highlight the 6-row (representative of the tier)
    if (currentPax >= 10) return n === 10;
    return n === currentPax;
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="text-teal-600 text-sm font-medium flex items-center gap-1.5 hover:text-teal-700 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {open ? 'Hide' : 'View'} all pricing tiers
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden text-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-3 py-2 text-left">Travelers</th>
                <th className="px-3 py-2 text-right">Per person</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-left hidden sm:table-cell">Tier</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map(tier => {
                const active = rowActive(tier);
                return (
                  <tr
                    key={tier.travelers}
                    className={`border-t border-gray-100 transition-colors ${
                      active
                        ? 'bg-teal-50 text-teal-800 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">
                      {tier.travelers}
                      {active && (
                        <span className="ml-2 text-xs bg-teal-500 text-white rounded-full px-1.5 py-0.5">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(tier.ratePerPerson)}
                    </td>
                    <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(tier.total)}
                    </td>
                    <td className="px-3 py-2 text-gray-400 text-xs hidden sm:table-cell">
                      {tier.tier}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-3 py-2 text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
            Base: {fmt(basePrice)} flat for up to 3 travelers · No taxes or hidden fees
          </p>
        </div>
      )}
    </div>
  );
}

import { fmt } from '../lib/pricing.js';

export default function ConfirmationModal({ tour, adults, children, infants, date, result, form, onClose, onConfirm }) {
  const dateStr = date || 'Not selected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-2xl px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-white font-bold text-lg">Review Your Booking</h2>
          <button type="button" onClick={onClose} className="text-white hover:text-teal-100 text-2xl leading-none" aria-label="Close">&times;</button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 text-sm">

          {/* Tour + date */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
            <p className="font-bold text-gray-900 text-base">{tour.name}</p>
            <p className="text-gray-500">{tour.duration} · {tour.category}</p>
            <p className="text-gray-600 mt-1">📅 {dateStr}</p>
            <p className="text-gray-600">
              👤 {adults} adult{adults !== 1 ? 's' : ''}
              {children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
              {infants  > 0 ? `, ${infants} infant${infants !== 1 ? 's' : ''} (free)` : ''}
            </p>
            <p className="text-xs font-medium text-teal-600 mt-1">{result.tierLabel}</p>
          </div>

          {/* Guest info */}
          <div className="space-y-1 text-gray-700">
            <p><span className="font-medium text-gray-500">Name:</span> {form.name}</p>
            <p><span className="font-medium text-gray-500">Email:</span> {form.email}</p>
            <p><span className="font-medium text-gray-500">Phone:</span> {form.phone}</p>
            {form.promo    && <p><span className="font-medium text-gray-500">Promo code:</span> {form.promo}</p>}
            {form.requests && <p><span className="font-medium text-gray-500">Special requests:</span> {form.requests}</p>}
          </div>

          {/* Price summary — no tax */}
          <div className="border-t border-gray-100 pt-3 space-y-1">
            <PriceLine label={`Adults (${adults} × ${fmt(result.adultRate)})`}   val={result.adultSubtotal} />
            {children > 0 && (
              <PriceLine label={`Children (${children} × ${fmt(result.childRate)})`} val={result.childSubtotal} />
            )}
            {infants > 0 && (
              <PriceLine label={`Infants (${infants} × $0.00)`} val={0} muted />
            )}
            {result.savingsPerPerson > 0 && (
              <PriceLine label="Group discount savings" val={-result.savingsTotal} green />
            )}

            <div className="border-t border-gray-200 my-2" />

            <div className="flex justify-between font-bold text-gray-900 text-lg">
              <span>TOTAL</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(result.total)}</span>
            </div>
            <p className="text-xs text-gray-400">No taxes or hidden fees · Price is final</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Edit
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-100"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceLine({ label, val, muted, green }) {
  return (
    <div className={`flex justify-between items-center ${
      muted  ? 'text-gray-400' :
      green  ? 'text-green-600 font-medium' :
               'text-gray-600'
    }`}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {green ? `−${fmt(Math.abs(val))}` : fmt(val)}
      </span>
    </div>
  );
}

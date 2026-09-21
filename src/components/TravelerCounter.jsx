/**
 * Reusable +/- traveler counter row.
 *
 * Props:
 *   label      – display name (e.g. "Adults")
 *   sublabel   – subtitle (e.g. "Age 13+")
 *   value      – current count
 *   min        – minimum allowed (default 0)
 *   max        – maximum allowed (default 15)
 *   onChange   – (newValue: number) => void
 *   tooltip    – optional string shown as an info tooltip next to the count
 */
export default function TravelerCounter({ label, sublabel, value, min = 0, max = 15, onChange, tooltip }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-800 text-sm">{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-9 h-9 rounded-full border-2 border-teal-500 text-teal-600 text-lg font-bold
                     flex items-center justify-center
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-teal-50 active:bg-teal-100 transition-colors"
        >
          −
        </button>

        <div className="relative flex items-center justify-center w-8">
          <span className="font-bold text-gray-900 text-base leading-none">{value}</span>

          {/* Optional tooltip icon */}
          {tooltip && (
            <div className="absolute -top-1 -right-4 group">
              <span className="cursor-help text-amber-500 text-xs leading-none">ℹ</span>
              <div className="hidden group-hover:block absolute right-0 top-5 z-20
                              w-56 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl
                              leading-relaxed whitespace-normal">
                {tooltip}
                <div className="absolute -top-1.5 right-1 w-3 h-3 bg-gray-900 rotate-45" />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-9 h-9 rounded-full border-2 border-teal-500 text-teal-600 text-lg font-bold
                     flex items-center justify-center
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-teal-50 active:bg-teal-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

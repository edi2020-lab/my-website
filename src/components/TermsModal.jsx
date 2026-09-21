export default function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-lg">Terms & Conditions</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-4 text-sm text-gray-700 space-y-4">
          <p className="text-xs text-gray-400">Effective: 1 January 2025 - PT. Diwira Wisata Indonesia</p>
          <C n={1} t="Booking Confirmation">Your booking is confirmed only upon receipt of a confirmation email from PT. Diwira Wisata Indonesia. We reserve the right to decline bookings that cannot be operationally fulfilled.</C>
          <C n={2} t="Payment">Full payment is required at booking. All prices are in USD. Currency conversion fees are the guest's responsibility.</C>
          <C n={3} t="Cancellation & Refunds">More than 72 hours before tour: full refund. 24-72 hours before: 50% refund. Less than 24 hours or no-show: no refund. Refunds processed within 7-14 business days.</C>
          <C n={4} t="Rescheduling">Tours may be rescheduled up to 48 hours before the original date at no charge, subject to availability. One reschedule per booking only. Rescheduled bookings are non-refundable.</C>
          <C n={5} t="Health & Safety">Guests must be in sufficient health to participate. We reserve the right to exclude any guest from activities for safety reasons without liability or refund.</C>
          <C n={6} t="Weather & Force Majeure">Tours cancelled by us due to severe weather, natural disaster, or government order will receive a full refund or free rescheduling. No additional compensation is payable.</C>
          <C n={7} t="Itinerary Changes">Itineraries may change due to traffic, site closures, or operational needs. Equivalent substitutions will be provided where possible. No refund is payable for such variations.</C>
          <C n={8} t="Children & Infants">Children 3-12 pay 70% of adult tier rate. Infants 0-2 are free but do not receive a dedicated seat. All minors must be accompanied by a responsible adult.</C>
          <C n={9} t="Liability">Our liability for any claim is limited to the total amount paid for the tour. We are not liable for personal injury, property loss, or consequential loss except where caused by our proven negligence.</C>
          <C n={10} t="Photography">By joining a tour you consent to photographs for promotional use. Opt out by notifying your guide at the tour start.</C>
          <C n={11} t="Travel Insurance">We strongly recommend comprehensive travel insurance. We are not responsible for costs that adequate insurance would have covered.</C>
          <C n={12} t="Governing Law">These Terms are governed by the laws of the Republic of Indonesia. Disputes are subject to the courts of Tabanan Regency, Bali.</C>
          <p className="text-xs text-gray-400 pt-2 border-t">By booking you confirm that you have read and agree to these Terms & Conditions.</p>
        </div>
        <div className="px-6 py-4 border-t">
          <button type="button" onClick={onClose} className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-xl hover:bg-teal-700">Close</button>
        </div>
      </div>
    </div>
  );
}
function C({ n, t, children }) {
  return <div><p className="font-semibold text-gray-800">{n}. {t}</p><p className="text-gray-600 mt-0.5">{children}</p></div>;
}

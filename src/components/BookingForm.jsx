import { useState, useMemo } from 'react';
import TravelerCounter from './TravelerCounter.jsx';
import PriceBreakdown from './PriceBreakdown.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';
import TermsModal from './TermsModal.jsx';
import { calculateTotal } from '../lib/pricing.js';

export default function BookingForm({ tour }) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [date, setDate] = useState('');
  const [form, setForm] = useState({ name:'', email:'', phone:'', promo:'', requests:'' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [booked, setBooked] = useState(false);
  const [errors, setErrors] = useState({});

  const setField = (k,v) => setForm(f => ({...f,[k]:v}));
  const result = useMemo(() => calculateTotal({ basePrice:tour.basePrice, adults, children, infants }), [tour.basePrice, adults, children, infants]);

  function validate() {
    const e = {};
    if (!date) e.date = 'Please select a tour date.';
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!termsAgreed) e.terms = 'You must agree to the Terms & Conditions.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) setShowConfirm(true);
  }

  if (booked) return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">&#10003;</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 mb-1">Thank you, <strong>{form.name}</strong>.</p>
        <p className="text-gray-500 mb-6">Confirmation sent to <strong>{form.email}</strong>.</p>
        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6">
          <p className="font-semibold text-gray-900">{tour.name}</p>
          <p>Date: {date}</p>
          <p>{adults} adult(s), {children} child(ren), {infants} infant(s)</p>
        </div>
        <a href="/" className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl">Back to Home</a>
      </div>
    </div>
  );

  const inp = (err) => `w-full border ${err ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400`;

  return (
    <>
      {showConfirm && <ConfirmationModal tour={tour} adults={adults} children={children} infants={infants} date={date} result={result} form={form} onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); setBooked(true); }} />}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 font-sans">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          <h1 className="font-bold text-gray-900">Book Your Tour</h1>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 text-sm">{tour.name}</span>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <img src={tour.image} alt={tour.name} className="w-full h-52 object-cover rounded-2xl mb-6 shadow-md" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">

              {/* Tour info */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 text-xl">{tour.name}</h2>
                <p className="text-teal-600 text-sm font-medium">{tour.duration} - {tour.category}</p>
                <p className="text-gray-500 text-sm mt-2">{tour.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tour.highlights.map(h => <span key={h} className="text-xs bg-teal-50 text-teal-700 rounded-full px-2.5 py-1">{h}</span>)}
                </div>
              </section>

              {/* Date */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">Tour Date</h3>
                <input type="date" value={date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => { setDate(e.target.value); setErrors(er => ({...er,date:undefined})); }}
                  className={inp(errors.date)} />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </section>

              {/* Travelers */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-1">Travelers</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Infants (0–2) are free and don't affect group pricing.
                  {(adults + children) <= 2
                    ? ` Flat price of $${tour.basePrice} applies for 1–3 travelers.`
                    : ''}
                </p>
                <TravelerCounter
                  label="Adults"
                  sublabel="Age 13+"
                  value={adults}
                  min={1}
                  onChange={setAdults}
                  tooltip={(adults + children) <= 2
                    ? `Same flat price of $${tour.basePrice} as 3 travelers — no extra charge for adding up to 3.`
                    : undefined}
                />
                <TravelerCounter
                  label="Children"
                  sublabel="Age 3–12 · 70% of adult tier rate"
                  value={children}
                  min={0}
                  onChange={setChildren}
                />
                <TravelerCounter
                  label="Infants"
                  sublabel="Age 0–2 · Free, excluded from group tier"
                  value={infants}
                  min={0}
                  onChange={setInfants}
                />
              </section>


              {/* Personal info */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-800">Your Details</h3>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Full Name *</label>
                  <input type="text" placeholder="Jane Smith" value={form.name}
                    onChange={e => { setField('name', e.target.value); setErrors(er => ({...er,name:undefined})); }}
                    className={inp(errors.name)} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Email Address *</label>
                  <input type="email" placeholder="jane@example.com" value={form.email}
                    onChange={e => { setField('email', e.target.value); setErrors(er => ({...er,email:undefined})); }}
                    className={inp(errors.email)} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Phone Number *</label>
                  <input type="tel" placeholder="+62 812 3456 7890" value={form.phone}
                    onChange={e => { setField('phone', e.target.value); setErrors(er => ({...er,phone:undefined})); }}
                    className={inp(errors.phone)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Promo Code (optional)</label>
                  <input type="text" placeholder="Enter promo code" value={form.promo}
                    onChange={e => setField('promo', e.target.value)} className={inp()} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Special Requests (optional)</label>
                  <textarea placeholder="Dietary requirements, accessibility needs..." value={form.requests}
                    onChange={e => setField('requests', e.target.value)} rows={3} className={inp() + ' resize-none'} />
                </div>
              </section>

              {/* What's included */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">What's Included</h3>
                <ul className="space-y-1.5">
                  {tour.includes.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-teal-500">&#10003;</span> {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* T&C */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={termsAgreed}
                    onChange={e => { setTermsAgreed(e.target.checked); setErrors(er => ({...er,terms:undefined})); }}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-600" />
                  <span className="text-sm text-gray-600">
                    I have read and agree to the{' '}
                    <button type="button" onClick={() => setShowTerms(true)}
                      className="text-teal-600 font-medium underline">Terms & Conditions</button>
                    {' '}of PT. Diwira Wisata Indonesia, including the cancellation and refund policy.
                  </span>
                </label>
                {errors.terms && <p className="text-red-500 text-xs mt-2">{errors.terms}</p>}
              </section>

              {/* Mobile price summary */}
              <div className="lg:hidden bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total · no taxes or hidden fees</p>
                  <p className="font-bold text-gray-900 text-xl">{result.total.toLocaleString('en-US', {style:'currency',currency:'USD'})}</p>
                </div>
                <button type="submit" disabled={adults < 1}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-40">Book Now</button>
              </div>

              {/* Desktop submit */}
              <button type="submit" disabled={adults < 1}
                className="hidden lg:block w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-orange-100">
                Book Now - Review Your Order
              </button>
            </form>

            {/* Sticky price card */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-20">
                <PriceBreakdown tour={tour} adults={adults} children={children} infants={infants} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

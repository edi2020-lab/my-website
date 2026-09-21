import BookingForm from './components/BookingForm.jsx';
import { getTourById } from './lib/tours.js';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const tour = getTourById(params.get('tour') || '');
  return <BookingForm tour={tour} />;
}

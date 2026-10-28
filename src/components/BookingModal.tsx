import React, { useState } from 'react';
import { Hotel, Room, Booking, User, BookingAddOn } from '../types';
import { AVAILABLE_ADDONS } from '../data/seedData';
import { StorageService } from '../services/storage';
import { X, Calendar, User as UserIcon, CreditCard, CheckCircle2, ShieldCheck, Tag, ArrowRight, ArrowLeft, Printer, Sparkles } from 'lucide-react';

interface BookingModalProps {
  hotel: Hotel | null;
  room: Room | null;
  currentUser: User | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  room,
  currentUser,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Stay dates & guests
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-20');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Guest details
  const [guestName, setGuestName] = useState(currentUser?.name || 'Elena Vance');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'elena@guest.com');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '+1 (555) 392-1084');
  const [specialRequests, setSpecialRequests] = useState('');

  // Selected add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<BookingAddOn[]>([]);

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Payment details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);

  // Created booking result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!hotel || !room) return null;

  // Calculation of nights
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(d2.getTime() - d1.getTime(), 1000 * 3600 * 24);
  const nights = Math.max(Math.round(diffTime / (1000 * 3600 * 24)), 1);

  const roomSubtotal = room.pricePerNight * nights;
  const taxesAndFees = Math.round(roomSubtotal * 0.12);
  const resortFee = 35 * nights;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = Math.max(roomSubtotal + taxesAndFees + resortFee + addOnsTotal - discountAmount, 0);

  const toggleAddOn = (addon: BookingAddOn) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUXURY2026') {
      setDiscountAmount(250);
      setPromoMessage('Promo code applied: $250 luxury discount deducted!');
    } else if (code === 'WELCOME50') {
      setDiscountAmount(50);
      setPromoMessage('Promo code applied: $50 welcome discount deducted!');
    } else {
      setDiscountAmount(0);
      setPromoMessage('Invalid coupon code. Try LUXURY2026.');
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newBooking = StorageService.createBooking({
        hotelId: hotel._id,
        hotelName: hotel.name,
        hotelCity: hotel.city,
        hotelImage: hotel.images?.[0] || '/src/assets/images/hero_hotel_resort_1793182729676.jpg',
        roomId: room._id,
        roomName: room.name,
        roomType: room.type,
        roomNumber: room.roomNumber,
        userId: currentUser?._id || 'usr-guest-01',
        customerName: guestName,
        customerEmail: guestEmail,
        customerPhone: guestPhone,
        checkIn,
        checkOut,
        nights,
        guests: { adults, children },
        basePrice: roomSubtotal,
        taxesAndFees,
        resortFee,
        discount: discountAmount,
        discountCode: discountAmount > 0 ? promoCode : undefined,
        addOns: selectedAddOns,
        totalPrice,
        paymentStatus: 'paid',
        bookingStatus: 'confirmed',
        specialRequests,
        paymentMethod: {
          brand: cardNumber.includes('4242') ? 'Visa' : 'Mastercard',
          cardLast4: '4242',
          transactionId: `txn_${Date.now()}`,
        },
      });

      setConfirmedBooking(newBooking);
      setStep(5);
      onBookingSuccess(newBooking);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 my-auto overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Progress */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-slate-900">
              {step === 5 ? 'Reservation Confirmed' : 'Reserve Your Luxury Stay'}
            </h3>
            <p className="text-xs text-slate-500 font-mono-data">
              {hotel.name} · {room.name}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {step < 5 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`px-2 py-0.5 rounded font-mono-data font-semibold ${step === 1 ? 'bg-amber-100 text-amber-900' : ''}`}>1. Dates</span>
                <span className="text-slate-300">/</span>
                <span className={`px-2 py-0.5 rounded font-mono-data font-semibold ${step === 2 ? 'bg-amber-100 text-amber-900' : ''}`}>2. Guest</span>
                <span className="text-slate-300">/</span>
                <span className={`px-2 py-0.5 rounded font-mono-data font-semibold ${step === 3 ? 'bg-amber-100 text-amber-900' : ''}`}>3. Add-ons</span>
                <span className="text-slate-300">/</span>
                <span className={`px-2 py-0.5 rounded font-mono-data font-semibold ${step === 4 ? 'bg-amber-100 text-amber-900' : ''}`}>4. Payment</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* STEP 1: Dates & Room Confirmation */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Confirm Stay Schedule & Guests
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Check-In Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Adults</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Adults</option>
                      <option value={4}>4 Adults</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Children</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                    >
                      <option value={0}>0 Children</option>
                      <option value={1}>1 Child</option>
                      <option value={2}>2 Children</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Complimentary Reservation Privileges</span>
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Direct bookings through HotelPro include priority check-in at 14:00, welcome artisan refreshments, and complimentary high-speed Wi-Fi 6.
                  </p>
                </div>
              </div>

              {/* Summary sidebar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <img
                    src={room.images?.[0] || hotel.images?.[0]}
                    alt={room.name}
                    className="w-full h-32 rounded-xl object-cover mb-3"
                    referrerPolicy="no-referrer"
                  />
                  <h5 className="text-xs font-semibold text-slate-500 uppercase">{hotel.name}</h5>
                  <h4 className="text-sm font-bold text-slate-900">{room.name}</h4>
                  <div className="mt-3 text-xs text-slate-600 space-y-1 font-mono-data">
                    <div className="flex justify-between">
                      <span>Length of stay:</span>
                      <span className="font-semibold">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per night:</span>
                      <span>${room.pricePerNight}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                      <span>Subtotal:</span>
                      <span>${roomSubtotal}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Information */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Guest Contact & Stay Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email for Confirmation</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (with Country Code)</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Occasions & Requests (Optional)</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Honeymoon celebration, dietary preferences, high-floor quiet room..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Select Add-Ons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Curated Add-ons */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Elevate Your Experience
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select tailored luxury services for your upcoming stay
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 font-mono-data">
                  Selected Add-ons: <span className="font-bold text-slate-900">${addOnsTotal}</span>
                </div>
              </div>

              <div className="space-y-3">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 h-4 w-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{addon.name}</h5>
                          <p className="text-xs text-slate-500 mt-0.5">{addon.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold font-mono-data text-slate-900">${addon.price}</span>
                        <span className="block text-[10px] text-slate-400">USD</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Gateway (Stripe Test Simulation) */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Details Form */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>Secure Payment Processing</span>
                  </h4>
                  <span className="text-[11px] font-mono-data text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Stripe Test Gateway Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">Card Number</label>
                      <button
                        type="button"
                        onClick={() => setCardNumber('4242 4242 4242 4242')}
                        className="text-[11px] text-amber-700 hover:underline font-mono-data"
                      >
                        Auto-fill Test Card
                      </button>
                    </div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono-data bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono-data bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Security Code (CVC)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono-data bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (Try LUXURY2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono-data uppercase bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {promoMessage && (
                  <p className={`text-xs ${discountAmount > 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                    {promoMessage}
                  </p>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-bit SSL encrypted. Your payment credentials are never stored in plaintext.</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Authorizing Payment...</span>
                    ) : (
                      <>
                        <span>Pay ${totalPrice} USD</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Price Breakdown Summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Invoice Breakdown
                  </h5>

                  <div className="space-y-2 text-xs text-slate-600 font-mono-data">
                    <div className="flex justify-between">
                      <span>Room ({nights} nights):</span>
                      <span>${roomSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & VAT (12%):</span>
                      <span>${taxesAndFees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resort Facilities Fee:</span>
                      <span>${resortFee}</span>
                    </div>

                    {selectedAddOns.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="block text-[11px] text-slate-500 font-sans font-semibold mb-1">Add-ons:</span>
                        {selectedAddOns.map((item) => (
                          <div key={item.id} className="flex justify-between text-[11px] text-slate-500">
                            <span className="truncate max-w-[140px]">{item.name}</span>
                            <span>${item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                        <span>Discount ({promoCode}):</span>
                        <span>-${discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-slate-300 font-bold text-slate-900 text-base">
                      <span>Total Due:</span>
                      <span>${totalPrice} USD</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                  <p>Check-In: <span className="font-semibold text-slate-800">{checkIn}</span></p>
                  <p>Check-Out: <span className="font-semibold text-slate-800">{checkOut}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Instant Confirmation & Digital Voucher */}
          {step === 5 && confirmedBooking && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-serif-luxury font-bold text-slate-900">
                  Your Sanctuary is Reserved
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  A formal confirmation email and voucher receipt have been issued to <span className="font-semibold text-slate-800">{confirmedBooking.customerEmail}</span>.
                </p>
              </div>

              {/* Digital Voucher Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Booking Reference</span>
                    <p className="text-base font-bold font-mono-data text-amber-900">{confirmedBooking.bookingCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Status</span>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Confirmed & Paid</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Hotel</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.hotelName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Suite Type</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.roomName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-In</span>
                    <span className="font-mono-data text-slate-800">{confirmedBooking.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-Out</span>
                    <span className="font-mono-data text-slate-800">{confirmedBooking.checkOut}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Guests</span>
                    <span className="text-slate-800">{confirmedBooking.guests.adults} Adults, {confirmedBooking.guests.children} Children</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Amount Paid</span>
                    <span className="font-mono-data font-bold text-slate-900">${confirmedBooking.totalPrice} USD</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  View in My Reservations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

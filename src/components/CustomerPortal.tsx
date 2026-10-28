import React, { useState } from 'react';
import { Booking, User, BookingStatus } from '../types';
import { StorageService } from '../services/storage';
import { Calendar, MapPin, Users, Printer, AlertCircle, CheckCircle, Clock, XCircle, Award, UserCheck, ShieldCheck, ChevronRight } from 'lucide-react';

interface CustomerPortalProps {
  currentUser: User | null;
  onExploreHotels: () => void;
  onUserUpdated: (user: User) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentUser,
  onExploreHotels,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled' | 'profile'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>(() =>
    currentUser ? StorageService.getUserBookings(currentUser._id) : []
  );

  // Profile edit form
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const refreshBookings = () => {
    if (currentUser) {
      setBookings(StorageService.getUserBookings(currentUser._id));
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    StorageService.cancelBooking(bookingId);
    setCancellingBooking(null);
    refreshBookings();
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const users = StorageService.getAllUsers();
    const idx = users.findIndex((u) => u._id === currentUser._id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, email, phone };
      localStorage.setItem('hotelpro_users_v2', JSON.stringify(users));
      StorageService.setCurrentUser(users[idx]);
      onUserUpdated(users[idx]);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'checked-in'
  );
  const pastBookings = bookings.filter((b) => b.bookingStatus === 'checked-out');
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner with Loyalty Summary */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-2xl">
                {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold">
                Welcome back, {currentUser?.name || 'Guest'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono-data">
              Member ID: {currentUser?._id || 'usr-guest-01'} · {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Loyalty Tier Strip */}
        <div className="flex items-center gap-6 bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Privilege Tier
            </span>
            <span className="text-base font-bold text-amber-300 font-serif-luxury">
              {currentUser?.loyaltyTier || 'Silver'} Member
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
              Reward Points
            </span>
            <span className="text-base font-bold text-white font-mono-data">
              {currentUser?.loyaltyPoints?.toLocaleString() || '1,000'} pts
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8 max-w-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'upcoming'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'past'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Past Stays ({pastBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'cancelled'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guest Profile
        </button>
      </div>

      {/* Tab: Upcoming & Active Bookings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-serif-luxury font-bold text-slate-900">No Upcoming Reservations</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore our curated luxury portfolio to plan your next peaceful sanctuary retreat.
              </p>
              <button
                onClick={onExploreHotels}
                className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {upcomingBookings.map((bkg) => (
                <div
                  key={bkg._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col lg:flex-row justify-between"
                >
                  <div className="flex flex-col sm:flex-row gap-5 p-6 flex-1">
                    <img
                      src={bkg.hotelImage || '/src/assets/images/hero_hotel_resort_1793182729676.jpg'}
                      alt={bkg.hotelName}
                      className="w-full sm:w-52 h-44 rounded-2xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Status tag */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            bkg.bookingStatus === 'checked-in'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {bkg.bookingStatus === 'checked-in' ? 'Currently Checked In' : 'Confirmed Reservation'}
                          </span>
                          <span className="text-xs font-mono-data text-slate-400">· Ref: {bkg.bookingCode}</span>
                        </div>

                        <h3 className="text-xl font-serif-luxury font-bold text-slate-900">
                          {bkg.hotelName}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          <span>{bkg.hotelCity}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-700">{bkg.roomName}</span>
                          {bkg.roomNumber && <span>(Suite #{bkg.roomNumber})</span>}
                        </p>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono-data">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-sans block">Check-In</span>
                            <span className="font-semibold text-slate-900">{bkg.checkIn}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-sans block">Check-Out</span>
                            <span className="font-semibold text-slate-900">{bkg.checkOut}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-sans block">Stay Length</span>
                            <span className="font-semibold text-slate-900">{bkg.nights} Nights</span>
                          </div>
                        </div>

                        {bkg.specialRequests && (
                          <p className="mt-2 text-[11px] text-slate-500 italic">
                            Special request: "{bkg.specialRequests}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price Panel */}
                  <div className="p-6 bg-slate-50/70 lg:w-72 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Total Paid
                      </span>
                      <div className="text-2xl font-bold font-mono-data text-slate-900">
                        ${bkg.totalPrice} <span className="text-xs font-normal text-slate-500">USD</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono-data block mt-1">
                        Card: {bkg.paymentMethod?.brand} •••• {bkg.paymentMethod?.cardLast4}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => window.print()}
                        className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice / Voucher</span>
                      </button>

                      {bkg.bookingStatus === 'confirmed' && (
                        <button
                          onClick={() => setCancellingBooking(bkg)}
                          className="w-full py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Past Stays */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs text-slate-500">No past completed stays recorded.</p>
            </div>
          ) : (
            pastBookings.map((bkg) => (
              <div
                key={bkg._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={bkg.hotelImage}
                    alt={bkg.hotelName}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{bkg.hotelName}</h4>
                    <p className="text-xs text-slate-500 font-mono-data">
                      {bkg.checkIn} to {bkg.checkOut} · {bkg.roomName}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold uppercase">Checked Out</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono-data text-slate-900">${bkg.totalPrice} USD</span>
                  <button
                    onClick={() => onExploreHotels()}
                    className="block mt-1 text-xs text-amber-700 hover:underline font-semibold"
                  >
                    Book Again
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Cancelled */}
      {activeTab === 'cancelled' && (
        <div className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs text-slate-500">No cancelled reservations.</p>
            </div>
          ) : (
            cancelledBookings.map((bkg) => (
              <div
                key={bkg._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between opacity-75"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-through">{bkg.hotelName}</h4>
                  <p className="text-xs text-slate-500 font-mono-data">
                    {bkg.checkIn} · Ref: {bkg.bookingCode}
                  </p>
                  <span className="text-[11px] text-red-600 font-semibold uppercase">Cancelled · 100% Refunded</span>
                </div>
                <div className="text-right text-xs font-mono-data text-slate-400">
                  Refunded ${bkg.totalPrice} USD
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Profile Edit */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-serif-luxury font-bold text-slate-900 mb-4">
            Guest Profile & Preferences
          </h3>

          {profileSaved && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Profile details saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to cancel your stay at <span className="font-semibold text-slate-800">{cancellingBooking.hotelName}</span> (Ref: {cancellingBooking.bookingCode})?
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              Under our flexible luxury policy, a full refund of ${cancellingBooking.totalPrice} USD will be credited to your original payment method.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Keep Reservation
              </button>
              <button
                onClick={() => handleCancelBooking(cancellingBooking._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

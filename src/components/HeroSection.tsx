import React, { useState } from 'react';
import { SearchQuery } from '../types';
import { Search, Calendar, Users, MapPin, Sparkles, Bed } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: Partial<SearchQuery>) => void;
  onExploreHotels: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreHotels }) => {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-20');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      destination,
      checkIn,
      checkOut,
      adults: guests,
      children: 0,
      roomType: roomType === 'All' ? undefined : roomType,
    });
  };

  const popularDestinations = ['Maldives', 'Tokyo', 'Kyoto', 'London', 'St. Moritz', 'Paris'];

  return (
    <section className="relative pt-6 pb-12 lg:pt-8 lg:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Container */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800">
          {/* Hero Photography Backdrop */}
          <div className="relative h-[480px] lg:h-[560px] w-full">
            <img
              src="/src/assets/images/hero_hotel_resort_1793182729676.jpg"
              alt="Luxury 5-star beachfront resort hotel with infinity pool"
              className="w-full h-full object-cover brightness-[0.78]"
              referrerPolicy="no-referrer"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Hero Copy */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16 max-w-4xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3">
                <span>The Global Standard in Luxury Hospitality</span>
                <span aria-hidden="true">·</span>
                <span>Handcrafted Stays</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight leading-[1.15] text-balance">
                Extraordinary Sanctuaries for the Discerning Traveler
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-light">
                Discover private island villas, historic European palaces, and skyline sanctuaries with guaranteed best rates, complimentary upgrades, and bespoke 24/7 butler service.
              </p>

              {/* Popular quick jump tags - functional interactive text buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400 font-medium">Trending Destinations:</span>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => {
                      setDestination(dest);
                      onSearch({ destination: dest });
                    }}
                    className="hover:text-amber-300 transition-colors underline decoration-slate-600 underline-offset-4"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated Search Console Bar */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 border-t border-slate-200/60">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Destination */}
              <div className="relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Destination / Hotel</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where would you like to escape?"
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Check-In */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Check-In</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Check-Out */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Check-Out</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-mono-data bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all text-slate-900"
                />
              </div>

              {/* Guests & Room Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>Guests</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white transition-all text-slate-900"
                >
                  <option value={1}>1 Adult · Solo Luxury</option>
                  <option value={2}>2 Adults · Couple Retreat</option>
                  <option value={3}>3 Adults · Small Group</option>
                  <option value={4}>4 Adults · Family Suite</option>
                  <option value={5}>5+ Guests · Private Villa</option>
                </select>
              </div>

              {/* Search Action */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Search Availability</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 4-Column Proof & Metrics Strip (Tabular Figures, Claim-to-Proof Adjacency) */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-200/80">
          <div>
            <p className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 font-mono-data">
              4.96<span className="text-sm font-sans text-slate-400 font-normal"> / 5.0</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">Verified Guest Satisfaction Score</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 font-mono-data">
              12,400+
            </p>
            <p className="text-xs text-slate-600 mt-1">Curated Reservations Completed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 font-mono-data">
              100%
            </p>
            <p className="text-xs text-slate-600 mt-1">Direct Best Rate & Upgrade Guarantee</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 font-mono-data">
              24 / 7
            </p>
            <p className="text-xs text-slate-600 mt-1">Bespoke Concierge & Butler Coverage</p>
          </div>
        </div>
      </div>
    </section>
  );
};

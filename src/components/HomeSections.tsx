import React from 'react';
import { Hotel } from '../types';
import { HotelCard } from './HotelCard';
import { Shield, Sparkles, Clock, Compass, Star, ArrowRight, Award, Coffee, HeartHandshake } from 'lucide-react';

interface HomeSectionsProps {
  hotels: Hotel[];
  onSelectHotel: (hotel: Hotel) => void;
  onExploreDestinations: (dest: string) => void;
  onViewAllHotels: () => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  hotels,
  onSelectHotel,
  onExploreDestinations,
  onViewAllHotels,
}) => {
  const featuredHotels = hotels.filter((h) => h.featured).slice(0, 3);

  const destinations = [
    {
      name: 'North Malé Atoll, Maldives',
      tagline: 'Private overwater pavilions & turquoise lagoons',
      image: '/src/assets/images/hero_hotel_resort_1793182729676.jpg',
      propertiesCount: 8,
      startingPrice: 840,
      searchKey: 'Maldives',
    },
    {
      name: 'Tokyo, Japan',
      tagline: 'High-altitude sky lounges & Hinoki cedar suites',
      image: '/src/assets/images/hotel_suite_interior_1793182729902.jpg',
      propertiesCount: 12,
      startingPrice: 620,
      searchKey: 'Tokyo',
    },
    {
      name: 'Kyoto, Japan',
      tagline: 'Centuries-old hot springs & bamboo forest sanctuaries',
      image: '/src/assets/images/hotel_wellness_spa_1793182731022.jpg',
      propertiesCount: 6,
      startingPrice: 710,
      searchKey: 'Kyoto',
    },
    {
      name: 'London, United Kingdom',
      tagline: 'Iconic Thames riverfront & Michelin dining salons',
      image: '/src/assets/images/hotel_fine_dining_1793182730870.jpg',
      propertiesCount: 14,
      startingPrice: 550,
      searchKey: 'London',
    },
  ];

  const testimonials = [
    {
      quote: 'The Azure Pavilion in the Maldives completely redefined our expectations of luxury hospitality. From the private reef excursion to having our butler prepare candlelit beach dining, every single moment was pure perfection.',
      author: 'Julian & Camilla Rossi',
      role: 'Private Equity Director',
      location: 'Geneva, Switzerland',
      stay: 'Stayed 6 nights at Ocean Sunset Villa',
      rating: 5,
    },
    {
      quote: 'HotelPro made booking our multi-city Japan honeymoon completely effortless. The Luminary in Tokyo and Aman Onsen in Kyoto were both breathtaking sanctuaries with flawless front-desk attentiveness.',
      author: 'Sophia Chen-Lin',
      role: 'Architectural Designer',
      location: 'San Francisco, USA',
      stay: 'Stayed 8 nights across Tokyo & Kyoto',
      rating: 5,
    },
    {
      quote: 'As an executive traveling constantly across European capitals, the direct booking rate guarantee and 24/7 concierge response time make HotelPro my only trusted reservation platform.',
      author: 'Lord Marcus Sterling',
      role: 'Technology Enterprise CEO',
      location: 'London, UK',
      stay: 'Stayed 4 nights at Crown River Suite',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-24 py-12">
      {/* SECTION 1: Featured Signature Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <span>Curated Selection</span>
              <span aria-hidden="true">·</span>
              <span>Signature Suites</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1">
              Featured Luxury Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Hand-inspected properties offering the world's most exceptional accommodations
            </p>
          </div>

          <button
            onClick={onViewAllHotels}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 transition-colors group shrink-0"
          >
            <span>View All Properties ({hotels.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
              onSelect={onSelectHotel}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: Popular Luxury Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>Iconic Locations</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Escapes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1">
            Popular Destinations for 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            From secluded tropical archipelagos to historic European capitals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => onExploreDestinations(dest.searchKey)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-950 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-mono-data text-amber-300 uppercase tracking-wider font-semibold">
                  From ${dest.startingPrice} USD / nt
                </span>
                <h3 className="text-lg font-serif-luxury font-bold mt-1 text-white group-hover:text-amber-200 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-light">
                  {dest.tagline}
                </p>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-slate-300">
                  <span>{dest.propertiesCount} Sanctuaries</span>
                  <span className="text-amber-300 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: The HotelPro Distinction (Capabilities Bento Strip) */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              The HotelPro Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white mt-1">
              Hospitality Curated with Absolute Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-light">
              We eliminate the uncertainty of luxury travel. Every reservation is directly managed with the property general manager to ensure VIP privileges from arrival to departure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Guaranteed Best Rates & Room Upgrades</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Book direct with no hidden intermediary commissions. Receive complimentary priority space-available room upgrades upon arrival.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 text-[11px] text-amber-300 font-mono-data">
                01. Rate Transparency Guarantee
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">24/7 Dedicated Butler & Concierge</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Every suite reservation includes a dedicated guest relations manager to handle private transfers, helicopter charters, and restaurant reservations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 text-[11px] text-amber-300 font-mono-data">
                02. White-Glove Attention
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Flexible Cancellation & Instant Refunds</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Travel plans change. Enjoy penalty-free cancellation on all eligible reservations up to 48 hours prior to check-in with automatic payment reversals.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/50 text-[11px] text-amber-300 font-mono-data">
                03. Peace of Mind
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Verified Testimonials (Claim-to-Proof Adjacency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mt-1">
            Trusted by the World's Most Discerning Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-4">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">{t.author}</p>
                <p className="text-[11px] text-slate-500">{t.role} · {t.location}</p>
                <p className="text-[10px] text-amber-800 font-medium mt-1">{t.stay}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
            <div>
              <span className="text-xl font-serif-luxury font-bold text-slate-900">
                HotelPro
              </span>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Complete hotel booking, reservations, and luxury hospitality management platform. Built on the MERN stack architecture.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Sanctuaries</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><button onClick={onViewAllHotels} className="hover:text-slate-900">All Hotels & Resorts</button></li>
                <li><button onClick={() => onExploreDestinations('Maldives')} className="hover:text-slate-900">Overwater Villas</button></li>
                <li><button onClick={() => onExploreDestinations('Tokyo')} className="hover:text-slate-900">Metropolitan Suites</button></li>
                <li><button onClick={() => onExploreDestinations('Kyoto')} className="hover:text-slate-900">Traditional Onsen Retreats</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Management</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><span className="text-slate-700 font-medium">Role-Based Access Control</span></li>
                <li><span className="text-slate-500">Super Administrator Dashboard</span></li>
                <li><span className="text-slate-500">Front Desk & Housekeeping</span></li>
                <li><span className="text-slate-500">Live Financial Analytics (ADR, RevPAR)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Security & Standards</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Stripe test mode payment simulation with 256-bit encryption. All reservations stored in synchronized high-performance datastore.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 font-mono-data">
            <p>© 2026 HotelPro Global Hospitality Group. All rights reserved.</p>
            <p>MERN Architecture · Node.js · Express · React · TypeScript</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

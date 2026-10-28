import React from 'react';
import { Hotel } from '../types';
import { Star, MapPin, ArrowRight, ShieldCheck, Coffee } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
  onQuickBook?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect, onQuickBook }) => {
  const primaryImage = hotel.images?.[0] || '/src/assets/images/hero_hotel_resort_1793182729676.jpg';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Visual media container with fallback */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS/SVG fallback
            const target = e.target as HTMLImageElement;
            target.src = '/src/assets/images/hero_hotel_resort_1793182729676.jpg';
          }}
        />

        {/* Quiet overlay badge if featured */}
        {hotel.featured && (
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider uppercase">
            Signature Collection
          </div>
        )}

        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-mono-data flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold">{hotel.ratingScore.toFixed(2)}</span>
          <span className="text-slate-400">({hotel.reviewCount})</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata - Clean Unboxed Text with Separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">{hotel.city}, {hotel.country}</span>
            <span aria-hidden="true">·</span>
            <span>{hotel.propertyType}</span>
            <span aria-hidden="true">·</span>
            <span>{hotel.totalRooms} Suites</span>
          </div>

          <h3 className="text-lg font-serif-luxury font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
            {hotel.name}
          </h3>

          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {hotel.tagline || hotel.description}
          </p>

          {/* Curated highlights */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-600">
            {hotel.freeCancellation && (
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Free cancellation</span>
              </span>
            )}
            {hotel.breakfastIncluded && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span className="text-slate-700 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-700" />
                  <span>Breakfast included</span>
                </span>
              </>
            )}
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500">{hotel.amenities[0]}</span>
          </div>
        </div>

        {/* Pricing & Call to Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              From per night
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 font-mono-data">
                ${hotel.pricePerNightStarting}
              </span>
              <span className="text-xs text-slate-500 font-normal">USD</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(hotel)}
            className="px-4 py-2 bg-slate-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm group-hover:shadow"
          >
            <span>View Suites</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

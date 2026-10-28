import React, { useState, useMemo } from 'react';
import { Hotel, SearchQuery, PropertyType } from '../types';
import { HotelCard } from './HotelCard';
import { Search, SlidersHorizontal, Map, Grid, ArrowUpDown, X, Star, Check, Sparkles, MapPin } from 'lucide-react';

interface HotelListingViewProps {
  hotels: Hotel[];
  searchQuery: Partial<SearchQuery>;
  onSelectHotel: (hotel: Hotel) => void;
  onUpdateSearch: (query: Partial<SearchQuery>) => void;
}

export const HotelListingView: React.FC<HotelListingViewProps> = ({
  hotels,
  searchQuery,
  onSelectHotel,
  onUpdateSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(searchQuery.destination || '');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [hoveredMapHotel, setHoveredMapHotel] = useState<Hotel | null>(null);

  const allAmenities = [
    'Private Overwater Deck',
    'Infinity Pool',
    'Reef Snorkeling & Diving',
    'Michelin-Star Seafood',
    'Butler Service 24/7',
    'Hydrotherapy Spa',
    'Panoramic Skyline Views',
    'Hinoki Cedar Soaking Tub',
    'Natural Geothermal Onsen',
    'Ski-in / Ski-out Access',
  ];

  const propertyTypes: (PropertyType | 'All')[] = [
    'All',
    'Beachfront Villa',
    'Urban Sanctuary',
    'Boutique Hotel',
    'Alpine Lodge',
    'Luxury Resort',
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPropertyType('All');
    setMaxPrice(1500);
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('recommended');
    onUpdateSearch({});
  };

  // Filtered & Sorted Hotels
  const filteredHotels = useMemo(() => {
    let result = [...hotels];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.city.toLowerCase().includes(term) ||
          h.country.toLowerCase().includes(term) ||
          h.name.toLowerCase().includes(term)
      );
    }

    if (propertyType !== 'All') {
      result = result.filter((h) => h.propertyType === propertyType);
    }

    result = result.filter((h) => h.pricePerNightStarting <= maxPrice);

    if (minRating > 0) {
      result = result.filter((h) => h.ratingScore >= minRating);
    }

    if (selectedAmenities.length > 0) {
      result = result.filter((h) =>
        selectedAmenities.every((amenity) => h.amenities.includes(amenity))
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePerNightStarting - b.pricePerNightStarting);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePerNightStarting - a.pricePerNightStarting);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.ratingScore - a.ratingScore);
    }

    return result;
  }, [hotels, searchTerm, propertyType, maxPrice, minRating, selectedAmenities, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & View Switch */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>HotelPro Global Collection</span>
            <span aria-hidden="true">·</span>
            <span>Handpicked Sanctuaries</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-slate-900 mt-1">
            Explore Luxury Hotels & Private Pavilions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Showing <strong className="font-mono-data text-slate-900">{filteredHotels.length}</strong> distinctive properties worldwide
          </p>
        </div>

        {/* View Toggle & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 text-xs bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recommended">Curator's Pick</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Guest Rating: Highest</option>
            </select>
          </div>

          {/* View mode buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Interactive Map Preview"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Type Category Filter Bar */}
      <div className="my-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {propertyTypes.map((type) => (
          <button
            key={type}
            onClick={() => setPropertyType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              propertyType === type
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            {type === 'All' ? 'All Collections' : type}
          </button>
        ))}
      </div>

      {/* Advanced Filter Ribbon */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search City or Hotel
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Maldives, Tokyo, Paris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Max Price per Night
              </label>
              <span className="text-xs font-mono-data font-bold text-slate-900">${maxPrice} USD</span>
            </div>
            <input
              type="range"
              min={400}
              max={2500}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-data">
              <span>$400</span>
              <span>$1,450</span>
              <span>$2,500+</span>
            </div>
          </div>

          {/* Star Rating Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Guest Score
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[0, 4.8, 4.9].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    minRating === rating
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+ ★`}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Clear */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>

        {/* Amenity Checklist Toggles */}
        <div className="pt-3 border-t border-slate-100">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Signature Amenities
          </span>
          <div className="flex flex-wrap gap-2">
            {allAmenities.slice(0, 7).map((amenity) => {
              const active = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-100 text-amber-950 font-semibold border border-amber-300'
                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-amber-800" />}
                  <span>{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW 1: GRID VIEW */}
      {viewMode === 'grid' && (
        <div>
          {filteredHotels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
              <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No properties match your exact filters</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Try widening your price range, clearing specific amenities, or searching for another world-class destination.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onSelect={onSelectHotel}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: INTERACTIVE MAP PREVIEW */}
      {viewMode === 'map' && (
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 min-h-[580px] flex flex-col justify-between p-6 shadow-xl">
          {/* Stylized dark-mode vector map backdrop */}
          <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-white max-w-md">
            <div>
              <p className="text-xs font-bold text-amber-400">Interactive Location Map</p>
              <p className="text-[11px] text-slate-400">Click a luxury pin to explore property details</p>
            </div>
            <span className="text-xs font-mono-data text-slate-300 font-bold">{filteredHotels.length} Pins Active</span>
          </div>

          {/* Map Pins Simulation Canvas */}
          <div className="relative z-10 my-12 flex-1 flex flex-wrap items-center justify-around gap-6 p-4">
            {filteredHotels.map((hotel, idx) => {
              const isHovered = hoveredMapHotel?._id === hotel._id;
              return (
                <div key={hotel._id} className="relative group">
                  <button
                    onClick={() => onSelectHotel(hotel)}
                    onMouseEnter={() => setHoveredMapHotel(hotel)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-data transition-all transform hover:scale-110 flex items-center gap-1.5 shadow-lg ${
                      isHovered
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30'
                        : 'bg-white text-slate-900 hover:bg-amber-100'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>${hotel.pricePerNightStarting}</span>
                  </button>

                  {/* Tooltip Card on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-2xl p-3 shadow-2xl border border-slate-200 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                      <img
                        src={hotel.images?.[0] || '/src/assets/images/hero_hotel_resort_1793182729676.jpg'}
                        alt={hotel.name}
                        className="w-full h-24 object-cover rounded-xl mb-2"
                        referrerPolicy="no-referrer"
                      />
                      <h4 className="text-xs font-bold text-slate-900 truncate">{hotel.name}</h4>
                      <p className="text-[11px] text-slate-500">{hotel.city}, {hotel.country}</p>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <span className="font-mono-data font-bold text-amber-900">${hotel.pricePerNightStarting}/nt</span>
                        <span className="text-amber-600 font-semibold">★ {hotel.ratingScore.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="relative z-10 self-start bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white" /> Available Suites
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Selected Property
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

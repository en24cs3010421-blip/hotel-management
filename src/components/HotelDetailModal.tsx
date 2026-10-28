import React, { useState } from 'react';
import { Hotel, Room, Review } from '../types';
import { StorageService } from '../services/storage';
import { X, Star, MapPin, ShieldCheck, Coffee, Users, BedDouble, Maximize2, Check, ArrowRight, MessageSquare, Send } from 'lucide-react';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  onBookRoom: (hotel: Hotel, room: Room) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  onClose,
  onBookRoom,
}) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'amenities' | 'reviews' | 'policies'>('rooms');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review submission state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!hotel) return null;

  const rooms: Room[] = StorageService.getRoomsByHotel(hotel._id);
  const reviews: Review[] = StorageService.getReviewsByHotel(hotel._id);

  const images = hotel.images?.length > 0 ? hotel.images : ['/src/assets/images/hero_hotel_resort_1793182729676.jpg'];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment || !newReviewAuthor) return;

    StorageService.addReview({
      hotelId: hotel._id,
      userId: `guest-${Date.now()}`,
      userName: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Magnificent Experience',
      comment: newReviewComment,
      stayDate: 'October 2026',
      roomType: rooms[0]?.name || 'Luxury Suite',
    });

    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">{hotel.city}, {hotel.country}</span>
              <span aria-hidden="true">·</span>
              <span>{hotel.propertyType}</span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center text-amber-600 font-bold font-mono-data">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                <span>{hotel.ratingScore.toFixed(2)}</span>
                <span className="text-slate-400 font-normal ml-1">({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900 mt-0.5">
              {hotel.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{hotel.address}</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hotel Description & Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-y border-slate-100">
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                About The Sanctuary
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {hotel.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{hotel.freeCancellation ? 'Free Cancellation (up to 48 hrs)' : 'Standard Cancellation Policy'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span>{hotel.breakfastIncluded ? 'Complimentary Gourmet Breakfast' : 'Breakfast Available'}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Guaranteed Best Rates
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono-data text-slate-900">
                    ${hotel.pricePerNightStarting}
                  </span>
                  <span className="text-xs text-slate-500">USD / night</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Includes all luxury guest privileges, direct booking perks, and concierge assignment.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Check-In:</span>
                  <span className="font-semibold text-slate-800 font-mono-data">{hotel.policies.checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-Out:</span>
                  <span className="font-semibold text-slate-800 font-mono-data">{hotel.policies.checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'rooms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Suites ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab('amenities')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'amenities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curated Amenities
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guest Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'policies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Policies & Location
            </button>
          </div>

          {/* Tab Content: Rooms & Suites */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif-luxury font-bold text-slate-900">
                  Select Your Suite or Pavilion
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Instant confirmation · Direct booking guarantee
                </span>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-600">No rooms currently listed for this property.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {rooms.map((room) => {
                    const isAvailable = room.status === 'available';
                    return (
                      <div
                        key={room._id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                          isAvailable
                            ? 'border-slate-200 hover:border-amber-500 hover:shadow-md bg-white'
                            : 'border-slate-200/60 bg-slate-50/70 opacity-80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <img
                            src={room.images?.[0] || images[0]}
                            alt={room.name}
                            className="w-full sm:w-36 h-28 rounded-xl object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                              <span>Suite #{room.roomNumber}</span>
                              <span aria-hidden="true">·</span>
                              <span>Floor {room.floor}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-slate-800">{room.type}</span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900">{room.name}</h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-lg">
                              {room.description}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <span>Up to {room.capacity.adults + room.capacity.children} guests</span>
                              </span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                                <span>{room.bedType}</span>
                              </span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span className="flex items-center gap-1">
                                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-mono-data">{room.sizeSqFt} sq ft</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-xl sm:text-2xl font-bold font-mono-data text-slate-900">
                              ${room.pricePerNight}
                            </div>
                            <span className="text-[11px] text-slate-500">per night + taxes</span>
                          </div>

                          {isAvailable ? (
                            <button
                              onClick={() => onBookRoom(hotel, room)}
                              className="px-5 py-2.5 bg-slate-900 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold transition-all shadow hover:shadow-md flex items-center gap-1.5"
                            >
                              <span>Reserve Suite</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="text-xs font-medium text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                              Currently {room.status}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Curated Amenities */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <h3 className="text-base font-serif-luxury font-bold text-slate-900">
                Signature Amenities & Experiences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif-luxury font-bold text-slate-900">
                    Verified Guest Experiences
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real impressions from certified travelers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono-data text-slate-900 flex items-center justify-end gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{hotel.ratingScore.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-slate-400">out of 5.0</span>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{rev.userName}</p>
                          <p className="text-[11px] text-slate-500">{rev.roomType} · {rev.stayDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-mono-data">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Inline Write Review Form */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                  <span>Share Your Experience</span>
                </h4>

                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Thank you! Your verified review has been published.</span>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Elena Vance"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Rating</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono-data"
                        >
                          <option value={5}>5 Stars - Exceeded All Expectations</option>
                          <option value={4}>4 Stars - Splendid Stay</option>
                          <option value={3}>3 Stars - Satisfactory</option>
                          <option value={2}>2 Stars - Needs Improvement</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Unmatched views and exquisite butler service"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Feedback</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe your stay, the suite comforts, and service highlights..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Review</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab Content: Policies & Location */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <h3 className="text-base font-serif-luxury font-bold text-slate-900">
                Property Policies & Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Check-in & Check-out Hours</h4>
                  <p className="text-xs text-slate-600">
                    Check-in starts at <span className="font-semibold text-slate-800 font-mono-data">{hotel.policies.checkInTime}</span>. Check-out is until <span className="font-semibold text-slate-800 font-mono-data">{hotel.policies.checkOutTime}</span>. Early check-in or late check-out may be coordinated with the front desk subject to availability.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Cancellation Guarantee</h4>
                  <p className="text-xs text-slate-600">
                    {hotel.policies.cancellationPolicy}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Pet Hospitality Policy</h4>
                  <p className="text-xs text-slate-600">
                    {hotel.policies.petPolicy}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 mb-1">Concierge & Contact</h4>
                  <p className="text-xs text-slate-600 font-mono-data">
                    Email: {hotel.contactEmail}<br />
                    Phone: {hotel.contactPhone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { Hotel, Room, Booking, User, Review, DashboardStats, SearchQuery, BookingStatus, RoomStatus } from '../types';
import { SEED_HOTELS, SEED_ROOMS, SEED_BOOKINGS, SEED_USERS, SEED_REVIEWS } from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'hotelpro_users_v2',
  CURRENT_USER: 'hotelpro_current_user_v2',
  HOTELS: 'hotelpro_hotels_v2',
  ROOMS: 'hotelpro_rooms_v2',
  BOOKINGS: 'hotelpro_bookings_v2',
  REVIEWS: 'hotelpro_reviews_v2',
};

// Initialize localStorage with seeds if not present
function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Elena Vance (Customer) for seamless immediate experience, or admin easily toggled
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[2]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOTELS)) {
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(SEED_HOTELS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(SEED_ROOMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
  }
}

initializeStorage();

export const StorageService = {
  // Auth & User Management
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return stored ? JSON.parse(stored) : SEED_USERS[2];
    } catch {
      return SEED_USERS[2];
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getAllUsers(): User[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  },

  login(email: string): { user: User; token: string } {
    const users = this.getAllUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-create or default to customer
      user = {
        _id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email: email.toLowerCase(),
        role: 'customer',
        loyaltyTier: 'Silver',
        loyaltyPoints: 1000,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setCurrentUser(user);
    const token = `jwt_mock_${user._id}_${Date.now()}`;
    return { user, token };
  },

  register(data: { name: string; email: string; phone?: string; role?: 'customer' | 'admin' | 'staff' }): { user: User; token: string } {
    const users = this.getAllUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      this.setCurrentUser(existing);
      return { user: existing, token: `jwt_mock_${existing._id}` };
    }
    const newUser: User = {
      _id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      role: data.role || 'customer',
      loyaltyTier: 'Silver',
      loyaltyPoints: 1000,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return { user: newUser, token: `jwt_mock_${newUser._id}` };
  },

  updateUserRole(userId: string, newRole: 'customer' | 'admin' | 'staff'): User[] {
    const users = this.getAllUsers().map((u) => (u._id === userId ? { ...u, role: newRole } : u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current._id === userId) {
      this.setCurrentUser({ ...current, role: newRole });
    }
    return users;
  },

  // Hotels Management
  getHotels(query?: Partial<SearchQuery>): Hotel[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HOTELS);
      let list: Hotel[] = stored ? JSON.parse(stored) : SEED_HOTELS;

      if (!query) return list;

      if (query.destination && query.destination.trim()) {
        const term = query.destination.toLowerCase().trim();
        list = list.filter(
          (h) =>
            h.city.toLowerCase().includes(term) ||
            h.country.toLowerCase().includes(term) ||
            h.name.toLowerCase().includes(term)
        );
      }

      if (query.propertyType && query.propertyType !== 'All') {
        list = list.filter((h) => h.propertyType === query.propertyType);
      }

      if (query.minRating) {
        list = list.filter((h) => h.ratingScore >= query.minRating!);
      }

      if (query.maxPrice) {
        list = list.filter((h) => h.pricePerNightStarting <= query.maxPrice!);
      }

      if (query.amenities && query.amenities.length > 0) {
        list = list.filter((h) => query.amenities!.every((a) => h.amenities.includes(a)));
      }

      if (query.sortBy === 'price-asc') {
        list.sort((a, b) => a.pricePerNightStarting - b.pricePerNightStarting);
      } else if (query.sortBy === 'price-desc') {
        list.sort((a, b) => b.pricePerNightStarting - a.pricePerNightStarting);
      } else if (query.sortBy === 'rating-desc') {
        list.sort((a, b) => b.ratingScore - a.ratingScore);
      }

      return list;
    } catch {
      return SEED_HOTELS;
    }
  },

  getHotelById(id: string): Hotel | undefined {
    return this.getHotels().find((h) => h._id === id);
  },

  createHotel(hotel: Omit<Hotel, '_id' | 'createdAt' | 'ratingScore' | 'reviewCount'>): Hotel {
    const hotels = this.getHotels();
    const newHotel: Hotel = {
      ...hotel,
      _id: `htl-${Date.now()}`,
      ratingScore: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
    };
    hotels.unshift(newHotel);
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
    return newHotel;
  },

  updateHotel(id: string, updates: Partial<Hotel>): Hotel {
    const hotels = this.getHotels();
    const index = hotels.findIndex((h) => h._id === id);
    if (index === -1) throw new Error('Hotel not found');
    hotels[index] = { ...hotels[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
    return hotels[index];
  },

  deleteHotel(id: string): void {
    const hotels = this.getHotels().filter((h) => h._id !== id);
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(hotels));
    // Also remove associated rooms
    const rooms = this.getAllRooms().filter((r) => r.hotelId !== id);
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  },

  // Rooms Management
  getAllRooms(): Room[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROOMS);
      return stored ? JSON.parse(stored) : SEED_ROOMS;
    } catch {
      return SEED_ROOMS;
    }
  },

  getRoomsByHotel(hotelId: string): Room[] {
    return this.getAllRooms().filter((r) => r.hotelId === hotelId);
  },

  getRoomById(id: string): Room | undefined {
    return this.getAllRooms().find((r) => r._id === id);
  },

  createRoom(room: Omit<Room, '_id'>): Room {
    const rooms = this.getAllRooms();
    const newRoom: Room = {
      ...room,
      _id: `rm-${Date.now()}`,
    };
    rooms.push(newRoom);
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    return newRoom;
  },

  updateRoom(id: string, updates: Partial<Room>): Room {
    const rooms = this.getAllRooms();
    const index = rooms.findIndex((r) => r._id === id);
    if (index === -1) throw new Error('Room not found');
    rooms[index] = { ...rooms[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    return rooms[index];
  },

  updateRoomStatus(id: string, status: RoomStatus): Room {
    return this.updateRoom(id, { status });
  },

  deleteRoom(id: string): void {
    const rooms = this.getAllRooms().filter((r) => r._id !== id);
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  },

  // Bookings Management
  getAllBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return stored ? JSON.parse(stored) : SEED_BOOKINGS;
    } catch {
      return SEED_BOOKINGS;
    }
  },

  getUserBookings(userId: string): Booking[] {
    return this.getAllBookings().filter((b) => b.userId === userId);
  },

  getBookingById(id: string): Booking | undefined {
    return this.getAllBookings().find((b) => b._id === id || b.bookingCode === id);
  },

  createBooking(data: Omit<Booking, '_id' | 'bookingCode' | 'createdAt'>): Booking {
    const bookings = this.getAllBookings();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingCode = `HP-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;

    const newBooking: Booking = {
      ...data,
      _id: `bkg-${Date.now()}`,
      bookingCode,
      createdAt: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Update room status to occupied if check-in is today
    if (data.roomId) {
      try {
        this.updateRoomStatus(data.roomId, 'occupied');
      } catch (e) {
        console.warn('Could not update room status', e);
      }
    }

    // Award loyalty points to user
    const users = this.getAllUsers();
    const userIndex = users.findIndex((u) => u._id === data.userId);
    if (userIndex !== -1) {
      const pointsEarned = Math.floor(data.totalPrice * 2);
      users[userIndex].loyaltyPoints = (users[userIndex].loyaltyPoints || 0) + pointsEarned;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      const current = this.getCurrentUser();
      if (current && current._id === data.userId) {
        this.setCurrentUser({ ...current, loyaltyPoints: users[userIndex].loyaltyPoints });
      }
    }

    return newBooking;
  },

  updateBookingStatus(id: string, status: BookingStatus, roomNumber?: string): Booking {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex((b) => b._id === id || b.bookingCode === id);
    if (index === -1) throw new Error('Booking not found');

    const updates: Partial<Booking> = { bookingStatus: status };
    if (roomNumber) updates.roomNumber = roomNumber;
    if (status === 'cancelled') {
      updates.paymentStatus = 'refunded';
    }

    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // If checked out or cancelled, update room status
    if (bookings[index].roomId) {
      if (status === 'checked-out') {
        this.updateRoomStatus(bookings[index].roomId, 'cleaning');
      } else if (status === 'cancelled') {
        this.updateRoomStatus(bookings[index].roomId, 'available');
      } else if (status === 'checked-in') {
        this.updateRoomStatus(bookings[index].roomId, 'occupied');
      }
    }

    return bookings[index];
  },

  cancelBooking(id: string): Booking {
    return this.updateBookingStatus(id, 'cancelled');
  },

  // Reviews
  getReviewsByHotel(hotelId: string): Review[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const all: Review[] = stored ? JSON.parse(stored) : SEED_REVIEWS;
      return all.filter((r) => r.hotelId === hotelId);
    } catch {
      return SEED_REVIEWS;
    }
  },

  addReview(data: Omit<Review, '_id' | 'createdAt'>): Review {
    const reviews: Review[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
    const newReview: Review = {
      ...data,
      _id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Update hotel rating
    const hotelReviews = reviews.filter((r) => r.hotelId === data.hotelId);
    const avgRating = Number(
      (hotelReviews.reduce((sum, r) => sum + r.rating, 0) / hotelReviews.length).toFixed(2)
    );
    this.updateHotel(data.hotelId, {
      ratingScore: avgRating,
      reviewCount: hotelReviews.length,
    });

    return newReview;
  },

  // Dashboard & Analytics
  getDashboardStats(): DashboardStats {
    const bookings = this.getAllBookings();
    const rooms = this.getAllRooms();

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'paid' && b.bookingStatus !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const activeStays = bookings.filter((b) => b.bookingStatus === 'checked-in').length;
    const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
    const availableRooms = rooms.filter((r) => r.status === 'available').length;
    const cleaningRooms = rooms.filter((r) => r.status === 'cleaning').length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;

    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
    const averageDailyRate =
      bookings.length > 0
        ? Math.round(
            totalRevenue /
              (bookings
                .filter((b) => b.paymentStatus === 'paid' && b.bookingStatus !== 'cancelled')
                .reduce((sum, b) => sum + b.nights, 0) || 1)
          )
        : 640;

    const revPAR = Math.round((occupancyRate / 100) * averageDailyRate);

    // Monthly breakdown
    const monthlyRevenue = [
      { month: 'Jun', revenue: 42000, bookings: 12 },
      { month: 'Jul', revenue: 68500, bookings: 19 },
      { month: 'Aug', revenue: 84200, bookings: 24 },
      { month: 'Sep', revenue: 73000, bookings: 21 },
      { month: 'Oct', revenue: 91400, bookings: 28 },
      { month: 'Nov (Proj)', revenue: 104000, bookings: 32 },
    ];

    return {
      totalRevenue,
      totalBookings: bookings.length,
      activeStays,
      occupancyRate,
      averageDailyRate,
      revPAR,
      totalRooms: rooms.length,
      availableRooms,
      cleaningRequiredRooms: cleaningRooms,
      maintenanceRooms,
      monthlyRevenue,
      recentBookings: bookings.slice(0, 8),
    };
  },

  // Reset to seed data
  resetDatabase(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.HOTELS, JSON.stringify(SEED_HOTELS));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(SEED_ROOMS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0])); // Sarah Connor (Admin)
  },
};

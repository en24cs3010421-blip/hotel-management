export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  loyaltyTier?: 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  loyaltyPoints?: number;
  createdAt: string;
}

export type PropertyType = 'Luxury Resort' | 'Boutique Hotel' | 'Urban Sanctuary' | 'Alpine Lodge' | 'Beachfront Villa';

export interface Hotel {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  country: string;
  address: string;
  starRating: number;
  ratingScore: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
  amenities: string[];
  propertyType: PropertyType;
  pricePerNightStarting: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  contactEmail: string;
  contactPhone: string;
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    petPolicy: string;
  };
  totalRooms: number;
  createdAt: string;
}

export type RoomType = 
  | 'Standard Deluxe'
  | 'Executive Suite'
  | 'Presidential Penthouse'
  | 'Oceanfront Pavilion'
  | 'Garden Wellness Villa';

export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning';

export interface Room {
  _id: string;
  hotelId: string;
  hotelName: string;
  roomNumber: string;
  floor: number;
  name: string;
  type: RoomType;
  pricePerNight: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  images: string[];
  status: RoomStatus;
  description: string;
}

export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Booking {
  _id: string;
  bookingCode: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  roomId: string;
  roomName: string;
  roomType: RoomType;
  roomNumber?: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  basePrice: number;
  taxesAndFees: number;
  resortFee: number;
  discount: number;
  discountCode?: string;
  addOns: BookingAddOn[];
  totalPrice: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  specialRequests?: string;
  paymentMethod: {
    brand: string;
    cardLast4: string;
    transactionId: string;
  };
  createdAt: string;
}

export interface Review {
  _id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  stayDate: string;
  roomType: string;
  createdAt: string;
}

export interface SearchQuery {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minRating?: number;
  amenities?: string[];
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeStays: number;
  occupancyRate: number;
  averageDailyRate: number;
  revPAR: number; // Revenue Per Available Room
  totalRooms: number;
  availableRooms: number;
  cleaningRequiredRooms: number;
  maintenanceRooms: number;
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
  recentBookings: Booking[];
}

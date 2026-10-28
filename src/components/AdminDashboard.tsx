import React, { useState } from 'react';
import { Hotel, Room, Booking, User, DashboardStats, RoomStatus, BookingStatus, PropertyType, RoomType } from '../types';
import { StorageService } from '../services/storage';
import { 
  BarChart3, 
  Building2, 
  Bed, 
  CalendarCheck, 
  Users, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  RotateCcw, 
  Search,
  Filter,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User | null;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'hotels' | 'rooms' | 'reservations' | 'users' | 'reports'>('analytics');

  // Live state
  const [stats, setStats] = useState<DashboardStats>(() => StorageService.getDashboardStats());
  const [hotels, setHotels] = useState<Hotel[]>(() => StorageService.getHotels());
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getAllRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getAllBookings());
  const [users, setUsers] = useState<User[]>(() => StorageService.getAllUsers());

  // Search & Filter state
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<string>('all');

  // Hotel creation modal
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelTagline, setNewHotelTagline] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('');
  const [newHotelCountry, setNewHotelCountry] = useState('');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelType, setNewHotelType] = useState<PropertyType>('Luxury Resort');
  const [newHotelPrice, setNewHotelPrice] = useState(650);
  const [newHotelRoomsCount, setNewHotelRoomsCount] = useState(24);

  // Room creation modal
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomHotelId, setNewRoomHotelId] = useState(hotels[0]?._id || '');
  const [newRoomNumber, setNewRoomNumber] = useState('105');
  const [newRoomFloor, setNewRoomFloor] = useState(1);
  const [newRoomName, setNewRoomName] = useState('Lagoon Sunset Villa');
  const [newRoomType, setNewRoomType] = useState<RoomType>('Oceanfront Pavilion');
  const [newRoomPrice, setNewRoomPrice] = useState(850);
  const [newRoomSize, setNewRoomSize] = useState(1200);

  const refreshAll = () => {
    setStats(StorageService.getDashboardStats());
    setHotels(StorageService.getHotels());
    setRooms(StorageService.getAllRooms());
    setBookings(StorageService.getAllBookings());
    setUsers(StorageService.getAllUsers());
  };

  // Actions
  const handleUpdateBookingStatus = (id: string, newStatus: BookingStatus) => {
    StorageService.updateBookingStatus(id, newStatus);
    refreshAll();
  };

  const handleUpdateRoomStatus = (id: string, newStatus: RoomStatus) => {
    StorageService.updateRoomStatus(id, newStatus);
    refreshAll();
  };

  const handleDeleteHotel = (id: string) => {
    if (confirm('Are you sure you want to delete this hotel and its rooms?')) {
      StorageService.deleteHotel(id);
      refreshAll();
    }
  };

  const handleDeleteRoom = (id: string) => {
    if (confirm('Delete this suite from inventory?')) {
      StorageService.deleteRoom(id);
      refreshAll();
    }
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelCity) return;

    StorageService.createHotel({
      name: newHotelName,
      tagline: newHotelTagline || 'Exclusive sanctuary retreat',
      description: 'An exceptional haven of tranquility and elegance offering private suites, world-class dining, and tailored guest service.',
      city: newHotelCity,
      country: newHotelCountry || 'Global',
      address: newHotelAddress || `${newHotelCity} Luxury Way`,
      starRating: 5,
      images: ['/src/assets/images/hero_hotel_resort_1793182729676.jpg'],
      featured: true,
      amenities: ['Private Spa', 'Michelin Dining', 'Butler Service', 'High-Speed Wi-Fi', 'Valet Limousine'],
      propertyType: newHotelType,
      pricePerNightStarting: newHotelPrice,
      freeCancellation: true,
      breakfastIncluded: true,
      contactEmail: `concierge@${newHotelName.toLowerCase().replace(/\s+/g, '')}.com`,
      contactPhone: '+1 (555) 019-9000',
      policies: {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival.',
        petPolicy: 'Pet luxury packages available upon request.',
      },
      totalRooms: newHotelRoomsCount,
    });

    setShowAddHotelModal(false);
    refreshAll();
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHotel = hotels.find((h) => h._id === newRoomHotelId) || hotels[0];
    if (!targetHotel) return;

    StorageService.createRoom({
      hotelId: targetHotel._id,
      hotelName: targetHotel.name,
      roomNumber: newRoomNumber,
      floor: newRoomFloor,
      name: newRoomName,
      type: newRoomType,
      pricePerNight: newRoomPrice,
      capacity: { adults: 2, children: 1 },
      bedType: '1 King Bed',
      sizeSqFt: newRoomSize,
      amenities: ['Balcony View', 'Deep Soaking Tub', 'Dyson Hairdryer', 'Nespresso Station'],
      images: ['/src/assets/images/hotel_suite_interior_1793182729902.jpg'],
      status: 'available',
      description: 'Expansive private suite with designer furnishings and panoramic scenic vistas.',
    });

    setShowAddRoomModal(false);
    refreshAll();
  };

  const handleUserRoleChange = (userId: string, newRole: 'customer' | 'staff' | 'admin') => {
    StorageService.updateUserRole(userId, newRole);
    refreshAll();
  };

  const handleResetData = () => {
    if (confirm('Reset entire system database to initial pristine seed data?')) {
      StorageService.resetDatabase();
      refreshAll();
    }
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Hotel', 'Room', 'Guest Name', 'Email', 'Check-In', 'Check-Out', 'Nights', 'Total Price', 'Status'];
    const rows = bookings.map((b) => [
      b.bookingCode,
      `"${b.hotelName}"`,
      `"${b.roomName}"`,
      `"${b.customerName}"`,
      b.customerEmail,
      b.checkIn,
      b.checkOut,
      b.nights,
      b.totalPrice,
      b.bookingStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HotelPro_Reservations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered reservations
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'all' || b.bookingStatus === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered rooms
  const filteredRooms = rooms.filter((r) =>
    selectedHotelForRooms === 'all' ? true : r.hotelId === selectedHotelForRooms
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <span>HotelPro Enterprise Suite</span>
            <span aria-hidden="true">·</span>
            <span>Administrative Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mt-1">
            Executive Hotel & Operations Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Financials</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-3.5 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to initial test data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Tabular Numerals & High Impact Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono-data text-slate-900">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs previous cycle</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
            <Bed className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono-data text-slate-900">
            {stats.occupancyRate}%
          </p>
          <p className="text-[11px] text-slate-500 font-mono-data mt-1">
            {stats.totalRooms - stats.availableRooms} / {stats.totalRooms} rooms assigned
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Daily Rate (ADR)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono-data text-slate-900">
            ${stats.averageDailyRate}
          </p>
          <p className="text-[11px] text-slate-500 font-mono-data mt-1">
            RevPAR: ${stats.revPAR} USD
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reservations</span>
            <CalendarCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-mono-data text-slate-900">
            {stats.totalBookings}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {stats.activeStays} guests checked-in
          </p>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Revenue</span>
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'hotels' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hotels Portfolio ({hotels.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'rooms' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bed className="w-3.5 h-3.5" />
          <span>Room Inventory ({rooms.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'reservations' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Reservations Manager ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Guests & Accounts ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Chart Simulation */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Revenue Performance by Month</h3>
                  <p className="text-xs text-slate-500">Gross reservation volume across all hotel properties</p>
                </div>
                <span className="text-xs font-mono-data font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Target: $100K/Mo
                </span>
              </div>

              {/* Bar visualization */}
              <div className="space-y-4">
                {stats.monthlyRevenue.map((item) => {
                  const maxRev = 110000;
                  const pct = Math.round((item.revenue / maxRev) * 100);
                  return (
                    <div key={item.month} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{item.month}</span>
                        <span className="font-mono-data text-slate-900 font-bold">
                          ${item.revenue.toLocaleString()} USD ({item.bookings} stays)
                        </span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-amber-700 rounded-lg transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Status Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Room Status Distribution</h3>
                <p className="text-xs text-slate-500 mb-6">Real-time status of physical room inventory</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </span>
                    <span className="text-xs font-mono-data font-bold text-slate-900">{stats.availableRooms} rooms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Occupied</span>
                    </span>
                    <span className="text-xs font-mono-data font-bold text-slate-900">
                      {stats.totalRooms - stats.availableRooms - stats.cleaningRequiredRooms - stats.maintenanceRooms} rooms
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>Housekeeping / Cleaning</span>
                    </span>
                    <span className="text-xs font-mono-data font-bold text-slate-900">{stats.cleaningRequiredRooms} rooms</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span>Maintenance</span>
                    </span>
                    <span className="text-xs font-mono-data font-bold text-slate-900">{stats.maintenanceRooms} rooms</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Total Portfolio Keys:</span>
                <span className="font-bold text-slate-900 font-mono-data">{stats.totalRooms}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOTELS PORTFOLIO */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Managed Hotels & Resorts</h3>
              <p className="text-xs text-slate-500">Configure property descriptions, starting prices, and photos</p>
            </div>
            <button
              onClick={() => setShowAddHotelModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Hotel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={hotel.images?.[0] || '/src/assets/images/hero_hotel_resort_1793182729676.jpg'}
                    alt={hotel.name}
                    className="w-full h-40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>{hotel.city}, {hotel.country}</span>
                      <span className="font-mono-data font-semibold text-slate-800">★ {hotel.ratingScore.toFixed(2)}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{hotel.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{hotel.tagline}</p>
                    <p className="mt-3 text-xs font-mono-data text-slate-900 font-bold">
                      Starting at ${hotel.pricePerNightStarting} USD/night · {hotel.totalRooms} Rooms
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{hotel.propertyType}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteHotel(hotel._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Hotel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROOM INVENTORY */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Room & Suite Inventory</h3>
              <p className="text-xs text-slate-500">Manage room prices, cleaning statuses, and capacities</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedHotelForRooms}
                onChange={(e) => setSelectedHotelForRooms(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Hotels</option>
                {hotels.map((h) => (
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Suite</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Room #</th>
                    <th className="py-3 px-4">Hotel</th>
                    <th className="py-3 px-4">Suite Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Rate / Night</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRooms.map((room) => (
                    <tr key={room._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono-data font-bold text-slate-900">{room.roomNumber}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{room.hotelName}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{room.name}</td>
                      <td className="py-3 px-4 text-slate-600">{room.type}</td>
                      <td className="py-3 px-4 text-slate-600">{room.capacity.adults} Adults</td>
                      <td className="py-3 px-4 font-mono-data font-semibold text-slate-900">${room.pricePerNight}</td>
                      <td className="py-3 px-4">
                        <select
                          value={room.status}
                          onChange={(e) => handleUpdateRoomStatus(room._id, e.target.value as RoomStatus)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border capitalize ${
                            room.status === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : room.status === 'occupied'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : room.status === 'cleaning'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Reservations Control Center</h3>
              <p className="text-xs text-slate-500">Inspect all booking lifecycle transitions, guest payments, and room assignments</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code, guest..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500 w-44"
                />
              </div>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked-In</option>
                <option value="checked-out">Checked-Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Booking Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((bkg) => (
                    <tr key={bkg._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono-data font-bold text-amber-900">{bkg.bookingCode}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{bkg.customerName}</p>
                        <p className="text-[11px] text-slate-400 font-mono-data">{bkg.customerEmail}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{bkg.hotelName}</p>
                        <p className="text-[11px] text-slate-500">{bkg.roomName} {bkg.roomNumber && `(#${bkg.roomNumber})`}</p>
                      </td>
                      <td className="py-3 px-4 font-mono-data text-slate-700">
                        {bkg.checkIn} → {bkg.checkOut} ({bkg.nights}n)
                      </td>
                      <td className="py-3 px-4 font-mono-data font-bold text-slate-900">${bkg.totalPrice}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold uppercase ${
                          bkg.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {bkg.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={bkg.bookingStatus}
                          onChange={(e) => handleUpdateBookingStatus(bkg._id, e.target.value as BookingStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border capitalize ${
                            bkg.bookingStatus === 'confirmed'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : bkg.bookingStatus === 'checked-in'
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : bkg.bookingStatus === 'checked-out'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="checked-in">Checked-In</option>
                          <option value="checked-out">Checked-Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => window.print()}
                          className="text-[11px] text-amber-700 hover:underline font-semibold"
                        >
                          Voucher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">User Accounts & Role Permissions</h3>
              <p className="text-xs text-slate-500">Assign role access levels (Customer, Hotel Staff, Super Admin)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Loyalty Tier</th>
                    <th className="py-3 px-4">Assigned Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono-data text-slate-600">{u.email}</td>
                      <td className="py-3 px-4 font-mono-data text-slate-600">{u.phone || '—'}</td>
                      <td className="py-3 px-4 text-amber-800 font-medium">
                        {u.loyaltyTier ? `${u.loyaltyTier} (${u.loyaltyPoints?.toLocaleString()} pts)` : 'Standard'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUserRoleChange(u._id, e.target.value as any)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 capitalize bg-white"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Hotel Staff</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Hotel */}
      {showAddHotelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Hotel Property</h3>
            <form onSubmit={handleCreateHotel} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hotel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mirage Palace"
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Majestic beachfront sanctuary"
                  value={newHotelTagline}
                  onChange={(e) => setNewHotelTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai"
                    value={newHotelCity}
                    onChange={(e) => setNewHotelCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UAE"
                    value={newHotelCountry}
                    onChange={(e) => setNewHotelCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={newHotelType}
                    onChange={(e) => setNewHotelType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Urban Sanctuary">Urban Sanctuary</option>
                    <option value="Alpine Lodge">Alpine Lodge</option>
                    <option value="Beachfront Villa">Beachfront Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starting Price ($ / night)</label>
                  <input
                    type="number"
                    value={newHotelPrice}
                    onChange={(e) => setNewHotelPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono-data"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddHotelModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
                >
                  Create Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Room to Inventory</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Hotel Property</label>
                <select
                  value={newRoomHotelId}
                  onChange={(e) => setNewRoomHotelId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  {hotels.map((h) => (
                    <option key={h._id} value={h._id}>{h.name} ({h.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono-data"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Floor Level</label>
                  <input
                    type="number"
                    value={newRoomFloor}
                    onChange={(e) => setNewRoomFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono-data"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Suite Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Horizon Suite"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suite Category</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Standard Deluxe">Standard Deluxe</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Penthouse">Presidential Penthouse</option>
                    <option value="Oceanfront Pavilion">Oceanfront Pavilion</option>
                    <option value="Garden Wellness Villa">Garden Wellness Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price per Night ($)</label>
                  <input
                    type="number"
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono-data"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
                >
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

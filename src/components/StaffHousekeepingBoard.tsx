import React, { useState } from 'react';
import { Room, Booking, User, RoomStatus, BookingStatus } from '../types';
import { StorageService } from '../services/storage';
import { Sparkles, Bed, Key, CheckCircle, Clock, AlertTriangle, ArrowRight, UserCheck, Shield, RefreshCw } from 'lucide-react';

interface StaffHousekeepingBoardProps {
  currentUser: User | null;
}

export const StaffHousekeepingBoard: React.FC<StaffHousekeepingBoardProps> = ({ currentUser }) => {
  const [rooms, setRooms] = useState<Room[]>(() => StorageService.getAllRooms());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getAllBookings());
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  const refresh = () => {
    setRooms(StorageService.getAllRooms());
    setBookings(StorageService.getAllBookings());
  };

  const handleUpdateStatus = (roomId: string, newStatus: RoomStatus) => {
    StorageService.updateRoomStatus(roomId, newStatus);
    refresh();
  };

  const handleQuickCheckIn = (booking: Booking) => {
    StorageService.updateBookingStatus(booking._id, 'checked-in', booking.roomNumber);
    setCheckInNotice(`Guest ${booking.customerName} checked into Suite #${booking.roomNumber || '101'}. Keycard encoded!`);
    refresh();
    setTimeout(() => setCheckInNotice(null), 3500);
  };

  const handleQuickCheckOut = (booking: Booking) => {
    StorageService.updateBookingStatus(booking._id, 'checked-out');
    setCheckInNotice(`Guest ${booking.customerName} checked out. Suite scheduled for housekeeping.`);
    refresh();
    setTimeout(() => setCheckInNotice(null), 3500);
  };

  const filteredRooms = rooms.filter((r) =>
    selectedStatusFilter === 'all' ? true : r.status === selectedStatusFilter
  );

  const activeArrivals = bookings.filter((b) => b.bookingStatus === 'confirmed');
  const currentDepartures = bookings.filter((b) => b.bookingStatus === 'checked-in');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Front Desk & Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
            <span>Front Desk & Housekeeping Operations</span>
            <span aria-hidden="true">·</span>
            <span>Staff Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900 mt-1">
            Room Status Board & Guest Reception
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono-data">
            Logged in: <strong className="text-slate-800">{currentUser?.name}</strong> (Staff Role)
          </span>
          <button
            onClick={refresh}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Operations Board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {checkInNotice && (
        <div className="my-6 p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{checkInNotice}</span>
        </div>
      )}

      {/* Reception Queue: Expected Arrivals & Departures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Arrivals Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-700" />
              <span>Pending Guest Check-Ins ({activeArrivals.length})</span>
            </h3>
            <span className="text-[11px] font-mono-data text-slate-400">Today's Queue</span>
          </div>

          {activeArrivals.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No pending guest arrivals awaiting check-in.</p>
          ) : (
            <div className="space-y-3">
              {activeArrivals.map((bkg) => (
                <div
                  key={bkg._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{bkg.customerName}</h5>
                    <p className="text-[11px] text-slate-500 font-mono-data">
                      Ref: {bkg.bookingCode} · Suite #{bkg.roomNumber || 'TBD'} ({bkg.roomType})
                    </p>
                    <span className="text-[10px] text-amber-800 font-medium">Check-In: {bkg.checkIn}</span>
                  </div>
                  <button
                    onClick={() => handleQuickCheckIn(bkg)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Check In</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Departures Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Active Stays & Check-Outs ({currentDepartures.length})</span>
            </h3>
            <span className="text-[11px] font-mono-data text-slate-400">In-House Guests</span>
          </div>

          {currentDepartures.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active guests currently checked-in.</p>
          ) : (
            <div className="space-y-3">
              {currentDepartures.map((bkg) => (
                <div
                  key={bkg._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{bkg.customerName}</h5>
                    <p className="text-[11px] text-slate-500 font-mono-data">
                      Suite #{bkg.roomNumber} · Depart: {bkg.checkOut} ({bkg.hotelName})
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase">Currently Occupied</span>
                  </div>
                  <button
                    onClick={() => handleQuickCheckOut(bkg)}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Check Out</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Housekeeping Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Housekeeping & Room Turnaround Board</h3>
            <p className="text-xs text-slate-500">Update physical status of rooms between guest turnover</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {['all', 'available', 'occupied', 'cleaning', 'maintenance'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  selectedStatusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Room grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const statusColor =
              room.status === 'available'
                ? 'border-emerald-300 bg-emerald-50/40'
                : room.status === 'occupied'
                ? 'border-amber-300 bg-amber-50/40'
                : room.status === 'cleaning'
                ? 'border-blue-300 bg-blue-50/40'
                : 'border-red-300 bg-red-50/40';

            return (
              <div
                key={room._id}
                className={`p-4 rounded-2xl border transition-all shadow-sm ${statusColor} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold font-mono-data text-slate-900">
                      Suite #{room.roomNumber}
                    </span>
                    <span className="text-[11px] font-mono-data text-slate-500">Floor {room.floor}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate">{room.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{room.hotelName}</p>

                  <div className="mt-3 py-1 px-2 rounded-lg bg-white/80 border border-slate-200/80 text-[11px] font-semibold flex items-center justify-between capitalize">
                    <span>Status:</span>
                    <span
                      className={`font-mono-data ${
                        room.status === 'available'
                          ? 'text-emerald-700'
                          : room.status === 'occupied'
                          ? 'text-amber-800'
                          : room.status === 'cleaning'
                          ? 'text-blue-800'
                          : 'text-red-700'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>

                {/* Status Switcher Actions */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-1.5 text-[10px]">
                  {room.status === 'cleaning' && (
                    <button
                      onClick={() => handleUpdateStatus(room._id, 'available')}
                      className="col-span-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Mark Clean & Ready</span>
                    </button>
                  )}

                  {room.status === 'available' && (
                    <button
                      onClick={() => handleUpdateStatus(room._id, 'occupied')}
                      className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
                    >
                      Assign Guest
                    </button>
                  )}

                  {room.status === 'occupied' && (
                    <button
                      onClick={() => handleUpdateStatus(room._id, 'cleaning')}
                      className="py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Request Clean
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleUpdateStatus(
                        room._id,
                        room.status === 'maintenance' ? 'available' : 'maintenance'
                      )
                    }
                    className="py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    {room.status === 'maintenance' ? 'Clear Issue' : 'Maintenance'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

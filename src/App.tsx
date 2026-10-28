/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Hotel, Room, Booking, SearchQuery } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HomeSections } from './components/HomeSections';
import { HotelListingView } from './components/HotelListingView';
import { HotelDetailModal } from './components/HotelDetailModal';
import { BookingModal } from './components/BookingModal';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffHousekeepingBoard } from './components/StaffHousekeepingBoard';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [activeView, setActiveView] = useState<'home' | 'hotels' | 'destinations' | 'my-bookings' | 'admin' | 'staff'>('home');
  const [hotels, setHotels] = useState<Hotel[]>(() => StorageService.getHotels());
  const [searchQuery, setSearchQuery] = useState<Partial<SearchQuery>>({});

  // Modals
  const [selectedHotelForDetail, setSelectedHotelForDetail] = useState<Hotel | null>(null);
  const [bookingTarget, setBookingTarget] = useState<{ hotel: Hotel; room: Room } | null>(null);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshData = () => {
    setHotels(StorageService.getHotels());
  };

  // Switch role or user
  const handleSelectUser = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    showToast(`Switched profile to ${user.name} (${user.role.toUpperCase()})`);
  };

  const handleCustomLogin = (name: string, email: string, role: 'customer' | 'admin' | 'staff') => {
    const res = StorageService.register({ name, email, role });
    setCurrentUser(res.user);
    showToast(`Logged in as ${res.user.name} (${role.toUpperCase()})`);
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Signed out successfully.');
    setActiveView('home');
  };

  const handleHeroSearch = (query: Partial<SearchQuery>) => {
    setSearchQuery(query);
    setActiveView('hotels');
  };

  const handleStartBooking = (hotel: Hotel, room: Room) => {
    setSelectedHotelForDetail(null);
    setBookingTarget({ hotel, room });
  };

  const handleBookingCompleted = (booking: Booking) => {
    showToast(`Reservation ${booking.bookingCode} confirmed! Added to My Reservations.`);
    refreshData();
  };

  // Safe navigation with role protection
  const handleNavigate = (view: 'home' | 'hotels' | 'destinations' | 'my-bookings' | 'admin' | 'staff') => {
    if (view === 'admin' && currentUser?.role !== 'admin') {
      setIsRoleSwitcherOpen(true);
      showToast('Admin access required. Select Sarah Connor or assign Admin role.');
      return;
    }
    if (view === 'staff' && currentUser?.role !== 'staff' && currentUser?.role !== 'admin') {
      setIsRoleSwitcherOpen(true);
      showToast('Front Desk / Staff access required. Select Mark Sterling or assign Staff role.');
      return;
    }

    if (view === 'destinations') {
      setActiveView('hotels');
      return;
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        onNavigate={handleNavigate}
        activeView={activeView}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Views */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <div>
            <HeroSection
              onSearch={handleHeroSearch}
              onExploreHotels={() => setActiveView('hotels')}
            />
            <HomeSections
              hotels={hotels}
              onSelectHotel={(h) => setSelectedHotelForDetail(h)}
              onExploreDestinations={(dest) => {
                setSearchQuery({ destination: dest });
                setActiveView('hotels');
              }}
              onViewAllHotels={() => setActiveView('hotels')}
            />
          </div>
        )}

        {/* VIEW 2: HOTELS LISTING & SEARCH */}
        {activeView === 'hotels' && (
          <HotelListingView
            hotels={hotels}
            searchQuery={searchQuery}
            onSelectHotel={(h) => setSelectedHotelForDetail(h)}
            onUpdateSearch={(q) => setSearchQuery(q)}
          />
        )}

        {/* VIEW 3: MY RESERVATIONS / CUSTOMER PORTAL */}
        {activeView === 'my-bookings' && (
          <CustomerPortal
            currentUser={currentUser}
            onExploreHotels={() => setActiveView('hotels')}
            onUserUpdated={(u) => setCurrentUser(u)}
          />
        )}

        {/* VIEW 4: ADMIN CONSOLE */}
        {activeView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigateHome={() => setActiveView('home')}
          />
        )}

        {/* VIEW 5: STAFF OPERATIONS BOARD */}
        {activeView === 'staff' && (
          <StaffHousekeepingBoard
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Hotel Detail Modal */}
      {selectedHotelForDetail && (
        <HotelDetailModal
          hotel={selectedHotelForDetail}
          onClose={() => setSelectedHotelForDetail(null)}
          onBookRoom={handleStartBooking}
        />
      )}

      {/* Booking Checkout Wizard Modal */}
      {bookingTarget && (
        <BookingModal
          hotel={bookingTarget.hotel}
          room={bookingTarget.room}
          currentUser={currentUser}
          onClose={() => setBookingTarget(null)}
          onBookingSuccess={handleBookingCompleted}
        />
      )}

      {/* Role & Account Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onCustomLogin={handleCustomLogin}
      />
    </div>
  );
}

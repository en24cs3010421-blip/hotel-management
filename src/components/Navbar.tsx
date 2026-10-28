import React, { useState } from 'react';
import { User } from '../types';
import { Hotel, User as UserIcon, Shield, Briefcase, CalendarCheck, LogOut, Check } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (view: 'home' | 'hotels' | 'destinations' | 'my-bookings' | 'admin' | 'staff') => void;
  activeView: string;
  onOpenRoleSwitcher: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigate,
  activeView,
  onOpenRoleSwitcher,
  onLogout,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-serif-luxury font-bold tracking-tight text-slate-900 hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Hotel className="w-6 h-6 text-amber-700" />
              <span>HotelPro</span>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeView === 'home' ? 'border-amber-700 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => onNavigate('hotels')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeView === 'hotels' ? 'border-amber-700 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              Hotels & Suites
            </button>
            <button
              onClick={() => onNavigate('destinations')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeView === 'destinations' ? 'border-amber-700 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              Destinations
            </button>
            <button
              onClick={() => onNavigate('my-bookings')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeView === 'my-bookings' ? 'border-amber-700 text-slate-900 font-semibold' : 'border-transparent'
              }`}
            >
              My Reservations
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                  activeView === 'admin' ? 'border-amber-700 text-amber-800 font-semibold' : 'border-transparent text-slate-700'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Console</span>
              </button>
            )}

            {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
              <button
                onClick={() => onNavigate('staff')}
                className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                  activeView === 'staff' ? 'border-amber-700 text-amber-800 font-semibold' : 'border-transparent text-slate-700'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                <span>Front Desk & Ops</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action / Account profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Role Switcher Button */}
            <button
              onClick={onOpenRoleSwitcher}
              className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Switch demo role (Customer, Staff, Admin)"
            >
              <span className="capitalize font-semibold text-slate-800">{currentUser?.role || 'Guest'}</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-700 font-medium">Switch Role</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                aria-expanded={profileMenuOpen}
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-sm">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                )}
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{currentUser?.name || 'Guest User'}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email || 'guest@hotelpro.com'}</p>
                    {currentUser?.loyaltyTier && (
                      <p className="mt-1 text-xs text-amber-700 font-medium">
                        {currentUser.loyaltyTier} Tier · {currentUser.loyaltyPoints?.toLocaleString()} pts
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => onNavigate('my-bookings')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-slate-400" />
                      <span>My Reservations</span>
                    </button>
                    <button
                      onClick={() => onNavigate('admin')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Admin Management</span>
                    </button>
                    <button
                      onClick={() => onNavigate('staff')}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>Staff Operations Board</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={onOpenRoleSwitcher}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Switch Demo Profile</span>
                      <Check className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

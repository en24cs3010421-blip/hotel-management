import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';
import { X, ShieldCheck, UserCheck, Briefcase, Plus, ArrowRight } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectUser: (user: User) => void;
  onCustomLogin: (name: string, email: string, role: UserRole) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onCustomLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'custom'>('profiles');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('customer');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    onCustomLogin(customName || customEmail.split('@')[0], customEmail, customRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">User Role & Account Switcher</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly test HotelPro from different role perspectives
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-100/70 border-b border-slate-200/80">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'profiles'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pre-Configured Demo Accounts
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create / Custom Login
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profiles' ? (
            <div className="space-y-3">
              {SEED_USERS.map((user) => {
                const isSelected = currentUser?._id === user._id || currentUser?.email === user.email;
                return (
                  <button
                    key={user._id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-sm">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-sm border border-slate-200">
                          {user.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />}
                          {user.role === 'staff' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                          {user.role === 'customer' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-800 transition-colors">
                            {user.name}
                          </h4>
                          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono-data mt-0.5">{user.email}</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {user.role === 'admin' && 'Access full management dashboard, revenue, rooms, and hotel creation'}
                          {user.role === 'staff' && 'Front desk operations, housekeeping board, and guest check-ins'}
                          {user.role === 'customer' && 'Browse, reserve suites, view active bookings & vouchers'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Ross"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. julian@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Access Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'staff', 'admin'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setCustomRole(r)}
                      className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                        customRole === r
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Sign In as {customRole}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

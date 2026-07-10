import React, { useState } from 'react';
import { Menu, X, Sparkles, Home, CalendarRange, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  profile: UserProfile | null;
  onLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, user, profile, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'booking', label: 'Book Service' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'admin', label: 'Admin Portal' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleSignOutClick = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          id="brand-logo" 
          onClick={() => handleNavClick('home')}
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              HOME<span className="text-teal-600">-MAID</span>
            </div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
              Reliable Care
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex md:items-center md:space-x-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors cursor-pointer relative py-2 ${
                  isActive 
                    ? 'text-teal-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-teal-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & User Badge Area */}
        <div className="hidden md:flex md:items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3.5 pl-3 border-l border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900">{profile?.name || user.email?.split('@')[0]}</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {user.email === 'admin@gmail.com' || user.email === 'admin.homemaid@gmail.com' || user.email === 'aarshpatel175@gmail.com' ? 'Super Admin' : 'Care Customer'}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-sm border border-teal-150">
                <UserIcon className="h-4 w-4" />
              </div>
              <button
                id="header-logout-btn"
                onClick={handleSignOutClick}
                title="Sign Out Account"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              id="header-cta-booking"
              onClick={() => handleNavClick('booking')}
              className="flex items-center space-x-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition cursor-pointer"
            >
              <CalendarRange className="h-4 w-4" />
              <span>Book Helpers Now</span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-b border-gray-100 bg-white md:hidden shadow-inner font-sans">
          <div className="space-y-1.5 px-4 pt-3 pb-5">
            {user && (
              <div className="flex items-center space-x-3 p-3 bg-teal-50/50 rounded-xl mb-3 border border-teal-100/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-850 font-bold self-center">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{profile?.name || "Care Customer"}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center rounded-xl px-4 py-3 text-base font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <div className="pt-4 border-t border-gray-100 mt-2 space-y-2">
              <button
                id="mobile-nav-cta"
                onClick={() => handleNavClick('booking')}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-teal-600 py-3 text-base font-semibold text-white shadow"
              >
                <CalendarRange className="h-5 w-5" />
                <span>Book Service Helper</span>
              </button>

              {user && (
                <button
                  id="mobile-nav-logout"
                  onClick={handleSignOutClick}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 py-3 text-base font-semibold transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

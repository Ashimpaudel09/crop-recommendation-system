"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  LayoutDashboard,
  Sprout,
  Receipt,
  DollarSign,
  PieChart,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Crops', path: '/dashboard/crops', icon: Sprout },
  { name: 'Expenses', path: '/dashboard/expenses', icon: Receipt },
  { name: 'Income', path: '/dashboard/income', icon: DollarSign },
  { name: 'Reports', path: '/dashboard/reports', icon: PieChart },
  { name: 'Recommendation', path: '/recommend', icon: Lightbulb, isPublic: true },
];

function NavLink({ item, isActive, onClick }) {
  return (
    <Link
      href={item.path}
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-2.5 text-[14px] transition-all duration-150 rounded-lg no-underline border-l-[3px] -ml-[3px] ${
        isActive
          ? 'font-medium text-accent-text bg-accent-light border-accent'
          : 'font-medium text-text-secondary border-transparent hover:bg-surface-raised hover:text-text-primary'
      }`}
    >
      <item.icon
        size={18}
        className={isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-primary'}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <span>{item.name}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // We wrap the entire dashboard layout in AuthGuard, but the layout structure itself is inside so the hook can run
  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-surface">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] border-r border-border bg-surface-card z-40 shadow-[var(--shadow-sm)]">
          <div className="h-[72px] flex items-center px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-accent text-white p-1.5 rounded-lg">
                <Sprout size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[19px] font-bold text-text-primary tracking-tight">CropSys</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-4 mb-2 mt-2">Main Menu</div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={pathname === item.path}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Link 
              href="/dashboard/profile"
              className={`flex items-center gap-3 p-2.5 rounded-lg mb-2 transition-colors ${pathname === '/dashboard/profile' ? 'bg-surface-raised' : 'hover:bg-surface-raised'}`}
            >
              <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-semibold shrink-0">
                {user?.firstname?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">
                  {user?.firstname} {user?.lastname}
                </div>
                <div className="text-xs text-text-muted truncate">Farmer Profile</div>
              </div>
            </Link>
            
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium text-danger hover:bg-danger-light rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-surface-card border-r border-border z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-[72px] flex items-center justify-between px-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="bg-accent text-white p-1.5 rounded-lg">
                <Sprout size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[19px] font-bold text-text-primary">CropSys</span>
            </div>
            <button className="text-text-secondary hover:text-text-primary p-1 bg-surface-raised rounded-md" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={pathname === item.path}
                onClick={() => setMobileOpen(false)}
              />
            ))}
            <div className="my-2 border-t border-border" />
            <NavLink
              item={{ name: 'Profile Settings', path: '/dashboard/profile', icon: UserCircle }}
              isActive={pathname === '/dashboard/profile'}
              onClick={() => setMobileOpen(false)}
            />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
          {/* Top Header */}
          <header className="sticky top-0 z-30 h-[72px] bg-surface-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded-md transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 text-[14px]">
                <span className="text-text-muted">Dashboard</span>
                <ChevronRight size={14} className="text-border-strong" />
                <span className="font-medium text-text-primary">
                  {NAV_ITEMS.find(i => i.path === pathname)?.name || (pathname === '/dashboard/profile' ? 'Profile' : 'Overview')}
                </span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-6 lg:p-10 w-full max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

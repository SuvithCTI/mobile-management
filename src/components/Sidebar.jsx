import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Smartphone,
  Headphones,
  ShoppingCart,
  Receipt,
  Users,
  BarChart3,
  Settings,
  LogOut,
  PackagePlus,
  X
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentUser, logout, lowStockMobiles } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Sales Staff'] },
    { id: 'pos', label: 'POS Billing', icon: ShoppingCart, badge: 'POS', badgeColor: 'bg-pink-200 text-[#701F47]', roles: ['Admin', 'Sales Staff'] },
    { id: 'mobiles', label: 'Mobiles', icon: Smartphone, badge: lowStockMobiles.length > 0 ? `${lowStockMobiles.length}` : null, badgeColor: 'bg-rose-200 text-[#701F47]', roles: ['Admin', 'Sales Staff'] },
    { id: 'accessories', label: 'Accessories', icon: Headphones, roles: ['Admin', 'Sales Staff'] },
    { id: 'purchases', label: 'Purchases', icon: PackagePlus, roles: ['Admin'] },
    { id: 'sales', label: 'Sales History', icon: Receipt, roles: ['Admin', 'Sales Staff'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['Admin', 'Sales Staff'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const userRole = currentUser?.role || 'Admin';
  const filteredNav = navItems.filter((item) => item.roles.includes(userRole));

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#701F47] text-white select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Logo size="sm" showTagline={false} dark={true} />

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-white text-[#701F47] font-extrabold shadow-md'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#701F47]' : 'text-white/90'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-transparent ${
                    isActive ? 'bg-[#701F47] text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3.5 border-t border-white/10 bg-black/15 flex items-center justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <h4 className="text-xs font-extrabold text-white truncate">{currentUser?.name || 'Staff'}</h4>
          <span className="text-[10px] text-pink-200 font-bold block mt-0.5">{currentUser?.role || 'User'}</span>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="p-2 text-white/80 hover:text-rose-300 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-56 border-r border-[#5c193a] shrink-0 h-screen shadow-md flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fade-in">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

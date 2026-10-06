import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Menu } from 'lucide-react';
import { LogoIcon } from './Logo';

export const Header = ({ onToggleMobileMenu }) => {
  const { currentUser, setActiveTab, storeSettings } = useApp();

  return (
    <header className="h-14 bg-[#701F47] text-white border-b border-[#5c193a] px-3 sm:px-6 flex items-center justify-between z-40 sticky top-0 shrink-0 w-full shadow-md">
      {/* Left: Mobile Menu Toggle & Brand Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 -ml-1 text-white hover:text-pink-200 rounded-xl hover:bg-white/10 transition cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <LogoIcon className="w-6 h-6 sm:hidden" />
          <span className="text-xs font-extrabold text-white hidden sm:flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-sky-300 shrink-0"></span>
            <span className="truncate tracking-wide">{storeSettings.storeName}</span>
          </span>
          <span className="text-sm font-black text-white sm:hidden tracking-tight">
            MobiPulse
          </span>
        </div>
      </div>

      {/* Right Side: Logged-in Role Badge & POS Action Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/20 border border-white/15 rounded-xl text-xs">
          <span className={`w-2 h-2 rounded-full shrink-0 ${currentUser?.role === 'Admin' ? 'bg-sky-400' : 'bg-pink-300'}`} />
          <span className="font-extrabold text-white hidden md:inline truncate max-w-[100px]">
            {currentUser?.name || 'User'}
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white/15 text-white">
            {currentUser?.role || 'Staff'}
          </span>
        </div>

        {/* POS Quick Button (High Contrast White & Burgundy) */}
        <button
          onClick={() => setActiveTab('pos')}
          className="px-3 py-1.5 bg-white hover:bg-slate-100 active:scale-95 text-[#701F47] rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">New Sale (POS)</span>
          <span className="sm:hidden font-black">POS</span>
        </button>
      </div>
    </header>
  );
};

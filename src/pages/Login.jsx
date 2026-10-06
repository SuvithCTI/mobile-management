import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogoIcon } from '../components/Logo';
import {
  Smartphone,
  Lock,
  User,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Store,
  ShoppingCart
} from 'lucide-react';

export const Login = () => {
  const { login, storeSettings } = useApp();

  const [portal, setPortal] = useState('Admin'); // 'Admin' | 'Sales Staff'
  const [username, setUsername] = useState('admin@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePortalSwitch = (selectedRole) => {
    setPortal(selectedRole);
    if (selectedRole === 'Admin') {
      setUsername('admin@gmail.com');
      setPassword('Admin@123');
    } else {
      setUsername('staff@gmail.com');
      setPassword('Staff@123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(username, password, portal);
      setLoading(false);
    }, 200);
  };

  const isAdmin = portal === 'Admin';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div
        className={`absolute top-12 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isAdmin ? 'bg-sky-200/50' : 'bg-pink-200/50'
        }`}
      />
      <div
        className={`absolute bottom-12 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isAdmin ? 'bg-indigo-200/40' : 'bg-rose-200/40'
        }`}
      />

      <div className="w-full max-w-md relative z-10 space-y-4">
        {/* Brand Banner */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
          <LogoIcon className="w-14 h-14" />
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              MobiPulse
            </h1>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Mobile Sales &amp; Inventory Management System
            </p>
          </div>
        </div>

        {/* Portal Selection Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => handlePortalSwitch('Admin')}
            className={`py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
              isAdmin
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
          <button
            type="button"
            onClick={() => handlePortalSwitch('Sales Staff')}
            className={`py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
              !isAdmin
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-black hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Staff Login</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          {/* Role Header & Permissions */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              isAdmin
                ? 'bg-sky-50/70 border-sky-200 text-sky-950'
                : 'bg-pink-50/70 border-pink-200 text-pink-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs flex items-center gap-1.5">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-sky-600" /> Administrator Portal
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-pink-600" /> Sales Staff Portal
                  </>
                )}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                  isAdmin
                    ? 'bg-white text-sky-800 border-sky-300'
                    : 'bg-white text-pink-800 border-pink-300'
                }`}
              >
                {isAdmin ? 'Full System Access' : 'POS & Sales'}
              </span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed">
              {isAdmin
                ? 'Access to Inventory, Purchases, Analytics Reports, Invoices & Store Settings.'
                : 'Access to POS Quick Billing, Stock Directory, Sales Invoices & Customer Registry.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Input */}
            <div>
              <label className="block font-bold text-black mb-1">
                {isAdmin ? 'Admin Email' : 'Staff Email'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isAdmin ? 'admin@gmail.com' : 'staff@gmail.com'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold text-xs focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-bold text-black mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold text-xs focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                isAdmin
                  ? 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700'
                  : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'
              }`}
            >
              <span>{loading ? 'Authenticating...' : `Sign In as ${isAdmin ? 'Admin' : 'Staff'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

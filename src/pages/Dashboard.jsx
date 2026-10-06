import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Headphones,
  TrendingUp,
  Users,
  Receipt,
  ShoppingBag,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const Dashboard = ({ onSelectSale }) => {
  const {
    mobiles,
    sales,
    customers,
    storeSettings,
    totalMobilesInStock,
    totalAccessoriesInStock,
    totalRevenue,
    setActiveTab
  } = useApp();

  const salesTrendData = [
    { day: 'Mon', sales: 42000 },
    { day: 'Tue', sales: 68000 },
    { day: 'Wed', sales: 94000 },
    { day: 'Thu', sales: 52000 },
    { day: 'Fri', sales: 138000 },
    { day: 'Sat', sales: 184000 },
    { day: 'Sun', sales: 176299 }
  ];

  const brandDataMap = {};
  mobiles.forEach((m) => {
    brandDataMap[m.brand] = (brandDataMap[m.brand] || 0) + (m.imeis?.filter((i) => i.status === 'in_stock').length || 0);
  });
  const brandDistribution = Object.keys(brandDataMap).map((brand) => ({
    name: brand,
    value: brandDataMap[brand]
  }));

  // Palette: Sky Blue, Lite Pink, Lite Red, Cool Grey
  const COLORS = ['#38bdf8', '#f472b6', '#fb7185', '#94a3b8', '#818cf8', '#34d399'];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner with soft sky blue & lite pink gradient */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-pink-50 to-rose-50 border border-sky-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-black">
            Welcome to <span className="text-sky-700 font-extrabold">{storeSettings.storeName}</span>
          </h2>
          <p className="text-xs font-semibold text-black">Live inventory, IMEI serials & POS billing overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            New Sale
          </button>
          <button
            onClick={() => setActiveTab('mobiles')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-black text-xs font-bold rounded-xl border border-slate-300 transition flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            Add Stock
          </button>
        </div>
      </div>

      {/* 4 Colored Metric Cards with Interactive Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Sky Blue Card: Revenue -> Navigates to Sales History */}
        <div
          onClick={() => setActiveTab('sales')}
          title="Click to view Sales History"
          className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100/70 hover:from-sky-100 hover:to-sky-200/70 border border-sky-200 hover:border-sky-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-xs font-bold text-black group-hover:text-sky-900 transition">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-sky-200/90 text-sky-900 group-hover:bg-sky-500 group-hover:text-white transition">
              <TrendingUp className="w-4 h-4 font-bold" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-black font-mono mt-1">
            {storeSettings.currency}{totalRevenue.toLocaleString()}
          </h3>
          <span className="text-[11px] text-black font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3 text-sky-800 font-bold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            {sales.length} invoices generated
          </span>
        </div>

        {/* 2. Lite Pink Card: Phones In Stock -> Navigates to Mobiles */}
        <div
          onClick={() => setActiveTab('mobiles')}
          title="Click to view Mobiles Inventory"
          className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/70 hover:from-pink-100 hover:to-pink-200/70 border border-pink-200 hover:border-pink-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-xs font-bold text-black group-hover:text-pink-900 transition">Phones In Stock</span>
            <div className="p-1.5 rounded-lg bg-pink-200/90 text-pink-900 group-hover:bg-pink-500 group-hover:text-white transition">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-black font-mono mt-1">
            {totalMobilesInStock} <span className="text-xs font-bold text-black">Units</span>
          </h3>
          <span className="text-[11px] text-black font-semibold mt-0.5 block">{mobiles.length} phone models</span>
        </div>

        {/* 3. Lite Red / Rose Card: Accessories -> Navigates to Accessories */}
        <div
          onClick={() => setActiveTab('accessories')}
          title="Click to view Accessories Catalog"
          className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/70 hover:from-rose-100 hover:to-rose-200/70 border border-rose-200 hover:border-rose-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-xs font-bold text-black group-hover:text-rose-900 transition">Accessories Stock</span>
            <div className="p-1.5 rounded-lg bg-rose-200/90 text-rose-900 group-hover:bg-rose-500 group-hover:text-white transition">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-black font-mono mt-1">
            {totalAccessoriesInStock} <span className="text-xs font-bold text-black">Pcs</span>
          </h3>
          <span className="text-[11px] text-black font-semibold mt-0.5 block">Ready for sale</span>
        </div>

        {/* 4. Refined Grey Card: Registered Accounts -> Navigates to Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          title="Click to view Registered Customers"
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-300 hover:border-slate-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <div className="flex items-center justify-between text-black mb-1">
            <span className="text-xs font-bold text-black group-hover:text-slate-900 transition">Registered Accounts</span>
            <div className="p-1.5 rounded-lg bg-slate-200 text-black group-hover:bg-slate-700 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-black font-mono mt-1">
            {customers.length} <span className="text-xs font-bold text-black">Accounts</span>
          </h3>
          <span className="text-[11px] text-black font-semibold mt-0.5 block">Active store accounts</span>
        </div>
      </div>

      {/* Grid: Sales Trend + Brand Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Trend Chart (Sky Blue Area) */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Weekly Revenue</h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-black border border-sky-200 font-bold">
              7-Day Volume
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesSkyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" stroke="#000000" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#000000" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '10px', color: '#000000', fontSize: '11px', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [`${storeSettings.currency}${Number(val).toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#salesSkyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Distribution Pie (Sky Blue, Lite Pink, Lite Red, Grey) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-black uppercase tracking-wider">Brand Stock</h3>
            <span className="text-[10px] font-bold text-black">In-stock units</span>
          </div>

          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {brandDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '8px', color: '#000000', fontSize: '11px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            {brandDistribution.map((b, i) => (
              <span key={b.name} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-black font-bold border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                {b.name} ({b.value})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

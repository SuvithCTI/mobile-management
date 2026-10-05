import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export const Reports = () => {
  const { sales, mobiles, accessories, storeSettings, totalInventoryValue, totalRevenue } = useApp();

  let estimatedTotalProfit = 0;
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      let costPrice = 0;
      if (item.type === 'mobile') {
        const mob = mobiles.find((m) => m.id === item.itemId);
        costPrice = mob ? mob.buyPrice : item.unitPrice * 0.85;
      } else {
        const acc = accessories.find((a) => a.id === item.itemId);
        costPrice = acc ? acc.buyPrice : item.unitPrice * 0.6;
      }
      const itemProfit = (item.unitPrice - costPrice) * item.qty;
      estimatedTotalProfit += itemProfit;
    });
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Invoice Number,Date,Customer Name,Customer Phone,Items,Payment Method,Grand Total\n';

    sales.forEach((s) => {
      const itemNames = s.items.map((i) => `${i.name} (x${i.qty})`).join(' | ').replace(/,/g, ' ');
      csvContent += `${s.invoiceNo},${new Date(s.date).toLocaleDateString()},"${s.customerName}","${s.customerPhone}","${itemNames}","${s.paymentMethod}",${s.grandTotal}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mobipulse_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const productPerformance = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productPerformance[item.name]) {
        productPerformance[item.name] = { name: item.name, units: 0, revenue: 0, type: item.type };
      }
      productPerformance[item.name].units += item.qty;
      productPerformance[item.name].revenue += item.total;
    });
  });

  const topSellingList = Object.values(productPerformance).sort((a, b) => b.revenue - a.revenue);

  const monthlyData = [
    { month: 'May', revenue: 210000, profit: 34000 },
    { month: 'Jun', revenue: 340000, profit: 56000 },
    { month: 'Jul', revenue: 290000, profit: 48000 },
    { month: 'Aug', revenue: 420000, profit: 71000 },
    { month: 'Sep', revenue: 510000, profit: 89000 },
    { month: 'Oct (Current)', revenue: totalRevenue, profit: estimatedTotalProfit }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-500" />
            Financial Reports & Analytics
          </h2>
          <p className="text-xs font-semibold text-black">
            Revenue volume, profit margin calculations, and inventory valuations
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Sales CSV
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-sky p-4 rounded-2xl border shadow-2xs">
          <span className="text-xs font-bold text-black">Total Sales Volume</span>
          <h3 className="text-2xl font-extrabold text-black font-mono mt-1.5">
            {storeSettings.currency}{totalRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">{sales.length} customer invoices</p>
        </div>

        <div className="card-pink p-4 rounded-2xl border shadow-2xs">
          <span className="text-xs font-bold text-black">Estimated Gross Profit</span>
          <h3 className="text-2xl font-extrabold text-pink-700 font-mono mt-1.5">
            {storeSettings.currency}{Math.round(estimatedTotalProfit).toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">~{Math.round((estimatedTotalProfit / (totalRevenue || 1)) * 100)}% Gross Margin</p>
        </div>

        <div className="card-rose p-4 rounded-2xl border shadow-2xs">
          <span className="text-xs font-bold text-black">Stock Inventory Value</span>
          <h3 className="text-2xl font-extrabold text-black font-mono mt-1.5">
            {storeSettings.currency}{totalInventoryValue.toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">Asset cost of in-stock catalog</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-black">Monthly Revenue vs Net Margin</h3>
            <p className="text-xs font-semibold text-black">Sales vs gross profit</p>
          </div>
          <span className="px-2.5 py-0.5 bg-slate-100 text-black border border-slate-300 rounded-lg text-xs font-bold">
            FY 2026-27
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#000000" fontSize={11} fontWeight={600} />
              <YAxis stroke="#000000" fontSize={11} fontWeight={600} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '8px', color: '#000000', fontSize: '12px', fontWeight: 600 }}
                formatter={(val) => [`${storeSettings.currency}${Number(val).toLocaleString()}`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#000000', fontWeight: 600 }} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Gross Profit" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
        <div>
          <h3 className="text-sm font-extrabold text-black">Top Performing Products</h3>
          <p className="text-xs font-semibold text-black">Ranked by revenue generation</p>
        </div>

        <div className="space-y-2">
          {topSellingList.map((prod, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/80 hover:bg-sky-50/40 rounded-2xl border border-slate-200 hover:border-sky-300 transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-900 font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border border-sky-200 shadow-2xs">
                  #{idx + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs text-black truncate max-w-full">
                      {prod.name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border shrink-0 ${
                        prod.type === 'mobile'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-pink-50 text-pink-800 border-pink-200'
                      }`}
                    >
                      {prod.type === 'mobile' ? 'Phone' : 'Accessory'}
                    </span>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    {prod.units} {prod.units === 1 ? 'unit sold' : 'units sold'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Revenue</span>
                <span className="font-mono font-extrabold text-xs sm:text-sm text-black">
                  {storeSettings.currency}{prod.revenue?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

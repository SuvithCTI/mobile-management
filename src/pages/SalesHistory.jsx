import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Search,
  Eye,
  Calendar
} from 'lucide-react';

export const SalesHistory = ({ onSelectSale }) => {
  const { sales, storeSettings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sale.customerPhone && sale.customerPhone.includes(searchQuery)) ||
      sale.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.imeis?.some((im) => im.includes(searchQuery)));
    const matchesPayment = paymentFilter === 'All' || sale.paymentMethod.includes(paymentFilter);
    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-pink-50 to-slate-50 border border-sky-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black">
              Sales <span className="text-sky-700 font-extrabold">Invoices Archive</span>
            </h2>
            <p className="text-xs font-semibold text-black">Search customer transaction bills & print receipts</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-white border border-slate-300 text-black text-xs font-bold rounded-xl shadow-2xs">
          Total Invoices: {sales.length}
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Invoice #, Customer, Phone, IMEI..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 text-black font-bold py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="All">All Payment Modes</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
          <option value="EMI">EMI</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-black font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-sky-50/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-800">
                    {sale.invoiceNo}
                  </td>
                  <td className="py-3 px-4 text-black font-semibold">
                    {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-black">{sale.customerName || 'Walk-in'}</div>
                    <div className="text-[10px] text-black font-semibold">{sale.customerPhone || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-black font-bold truncate">
                      {sale.items.map((i) => i.name).join(', ')}
                    </div>
                    <div className="text-[10px] text-black font-semibold">
                      {sale.items.reduce((s, i) => s + i.qty, 0)} unit(s)
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-pink-50 text-pink-800 border border-pink-200 rounded-md font-bold text-[10px]">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-black text-xs">
                    {storeSettings.currency}{sale.grandTotal?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectSale(sale)}
                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg transition text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

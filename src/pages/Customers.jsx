import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Plus,
  Search,
  MessageCircle,
  ShoppingBag,
  Trash2,
  X
} from 'lucide-react';

export const Customers = ({ onSelectSale }) => {
  const { customers, sales, storeSettings, addCustomer, deleteCustomer, notify, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      notify('Name and Phone are required', 'error');
      return;
    }
    addCustomer(formData);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', email: '', address: '' });
  };

  const customerSales = selectedCustomer
    ? sales.filter(
        (s) =>
          s.customerId === selectedCustomer.id ||
          (s.customerPhone && s.customerPhone === selectedCustomer.phone)
      )
    : [];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-pink-50 border border-sky-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black">
              Customers <span className="text-sky-700 font-extrabold">CRM & Loyalty</span>
            </h2>
            <p className="text-xs font-semibold text-black">Profiles, purchase histories & 1-click WhatsApp messaging</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCustomers.map((cust) => {
          const cleanPhone = cust.phone.replace(/[^0-9]/g, '');

          return (
            <div
              key={cust.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3 hover:border-sky-200 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-100 to-pink-100 border border-sky-200 flex items-center justify-center text-sky-800 font-bold text-xs">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-xs">{cust.name}</h3>
                      <span className="text-[11px] text-black font-semibold">{cust.phone}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${cust.name}?`)) deleteCustomer(cust.id);
                      }}
                      className="text-black hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-2.5 p-2 bg-slate-50 rounded-xl text-xs text-black flex items-center justify-between border border-slate-200">
                  <span className="text-[11px] text-black font-semibold">Total Spent:</span>
                  <strong className="font-mono text-sky-800 font-extrabold">{storeSettings.currency}{(cust.totalPurchases || 0).toLocaleString()}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs">
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-[11px]"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-700 font-bold" /> WhatsApp
                </a>

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="flex-1 py-1 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl font-bold transition flex items-center justify-center gap-1 text-[11px]"
                >
                  <ShoppingBag className="w-3 h-3 text-sky-700" /> History
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-black">
                Purchases: {selectedCustomer.name}
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-black hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2">
              {customerSales.length === 0 ? (
                <div className="py-6 text-center text-black font-bold text-xs">No orders found</div>
              ) : (
                customerSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-sky-800">{sale.invoiceNo}</span>
                      <span className="text-black font-semibold text-[10px] ml-2">
                        {new Date(sale.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-black font-mono">
                        {storeSettings.currency}{sale.grandTotal?.toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCustomer(null);
                          if (onSelectSale) onSelectSale(sale);
                        }}
                        className="px-2 py-0.5 bg-sky-500 text-white font-bold rounded-lg text-[11px]"
                      >
                        Bill
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold text-black text-sm">New Customer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-black hover:text-rose-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="block text-black mb-0.5 font-bold">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                />
              </div>

              <div>
                <label className="block text-black mb-0.5 font-bold">Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-black font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

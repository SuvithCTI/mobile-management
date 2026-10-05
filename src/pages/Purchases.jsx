import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PackagePlus,
  Plus,
  Search,
  Truck,
  X
} from 'lucide-react';

export const Purchases = () => {
  const { purchases, mobiles, accessories, storeSettings, createPurchase, notify } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [supplierGst, setSupplierGst] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer (NEFT/RTGS)');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState([
    { type: 'mobile', itemId: mobiles[0]?.id || '', name: '', qty: 1, unitCost: '', imeisText: '' }
  ]);

  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      { type: 'mobile', itemId: mobiles[0]?.id || '', name: '', qty: 1, unitCost: '', imeisText: '' }
    ]);
  };

  const handleRemoveItemRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === 'itemId') {
            if (updated.type === 'mobile') {
              const mob = mobiles.find((m) => m.id === value);
              if (mob) {
                updated.name = `${mob.brand} ${mob.model} (${mob.ram}/${mob.storage})`;
                updated.unitCost = mob.buyPrice || '';
              }
            } else {
              const acc = accessories.find((a) => a.id === value);
              if (acc) {
                updated.name = acc.name;
                updated.unitCost = acc.buyPrice || '';
              }
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotalBill = () => {
    return items.reduce((sum, item) => {
      const q = Number(item.qty) || 0;
      const c = Number(item.unitCost) || 0;
      return sum + q * c;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!supplierName.trim()) {
      notify('Supplier Name is required', 'error');
      return;
    }

    const processedItems = items.map((item) => {
      let imeisList = [];
      if (item.type === 'mobile' && item.imeisText) {
        imeisList = item.imeisText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean);
      }
      return {
        type: item.type,
        itemId: item.itemId,
        name: item.name || 'Purchased Device',
        qty: Number(item.qty) || 1,
        unitCost: Number(item.unitCost) || 0,
        totalCost: (Number(item.qty) || 1) * (Number(item.unitCost) || 0),
        imeis: imeisList
      };
    });

    createPurchase({
      billNumber: billNumber || `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      supplierName,
      supplierContact,
      supplierGst,
      date,
      items: processedItems,
      totalAmount: calculateTotalBill(),
      paymentStatus: 'Paid',
      paymentMethod,
      notes
    });

    setIsModalOpen(false);
    setSupplierName('');
    setSupplierContact('');
    setSupplierGst('');
    setBillNumber('');
    setItems([{ type: 'mobile', itemId: mobiles[0]?.id || '', name: '', qty: 1, unitCost: '', imeisText: '' }]);
  };

  const filteredPurchases = purchases.filter((po) => {
    return (
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.billNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-pink-50 border border-sky-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black">
              Purchases & <span className="text-sky-700 font-extrabold">Stock In</span>
            </h2>
            <p className="text-xs font-semibold text-black">Track supplier orders, invoices & stock additions</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Record Purchase
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Supplier, Bill number, or Item..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-slate-100 border border-slate-300 text-black font-bold rounded-xl">
            Total Orders: {filteredPurchases.length}
          </span>
          <span className="px-3 py-1 bg-sky-50 border border-sky-200 text-sky-900 font-extrabold font-mono rounded-xl">
            Total: {storeSettings.currency}{filteredPurchases.reduce((s, p) => s + (p.totalAmount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Clean & Simple Purchases Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-black font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bill / PO #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier Details</th>
                <th className="py-3 px-4">Items Purchased</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-black font-bold text-xs">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((po) => (
                  <tr key={po.id} className="hover:bg-sky-50/40 transition">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sky-800 text-xs">
                      {po.billNumber}
                    </td>
                    <td className="py-3.5 px-4 text-black font-semibold whitespace-nowrap">
                      {new Date(po.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-black text-xs">{po.supplierName}</div>
                      <div className="text-[10px] text-black font-semibold">
                        {po.supplierContact ? `Tel: ${po.supplierContact}` : ''}
                        {po.supplierGst ? ` • GST: ${po.supplierGst}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="space-y-1">
                        {po.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 flex-wrap text-black">
                            <span className="font-bold text-black">{item.name}</span>
                            <span className="px-1.5 py-0.2 bg-slate-100 text-black font-mono font-extrabold rounded border border-slate-300 text-[10px]">
                              {item.qty} pcs
                            </span>
                            <span className="text-[10px] font-mono text-slate-600">
                              (@ {storeSettings.currency}{item.unitCost?.toLocaleString()})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-black border border-slate-300 rounded-md font-bold text-[10px]">
                        {po.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-black text-xs whitespace-nowrap">
                      {storeSettings.currency}{po.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Purchase Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-black">Record Supplier Stock In</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-black hover:text-rose-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-black font-bold mb-1">Supplier *</label>
                  <input
                    type="text"
                    required
                    placeholder="Supplier name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-black font-bold"
                  />
                </div>
                <div>
                  <label className="block text-black font-bold mb-1">Supplier Contact</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={supplierContact}
                    onChange={(e) => setSupplierContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-black font-bold"
                  />
                </div>
                <div>
                  <label className="block text-black font-bold mb-1">Bill Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-99"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-black font-mono font-bold"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-black text-xs">Products & IMEI Batching</h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold hover:bg-sky-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-3">
                        <label className="block text-black font-bold mb-0.5">Type</label>
                        <select
                          value={item.type}
                          onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-black font-bold"
                        >
                          <option value="mobile">Smartphone</option>
                          <option value="accessory">Accessory</option>
                        </select>
                      </div>

                      <div className="col-span-4">
                        <label className="block text-black font-bold mb-0.5">Model</label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(idx, 'itemId', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-black font-bold"
                        >
                          {item.type === 'mobile'
                            ? mobiles.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.brand} {m.model}
                                </option>
                              ))
                            : accessories.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.brand} {a.name}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-black font-bold mb-0.5">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-black font-mono font-bold"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-black font-bold mb-0.5">Cost</label>
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-black font-mono font-bold"
                        />
                      </div>

                      <div className="col-span-1 flex items-end">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1.5 text-black hover:text-rose-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {item.type === 'mobile' && (
                      <div>
                        <label className="block text-[11px] text-sky-800 font-mono font-bold mb-0.5">
                          Paste IMEIs for these {item.qty} phone(s) (1 per line):
                        </label>
                        <textarea
                          rows={2}
                          value={item.imeisText}
                          onChange={(e) => handleItemChange(idx, 'imeisText', e.target.value)}
                          placeholder="359124089123451"
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 text-black font-mono text-xs font-bold"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total and notes */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-black font-bold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-black font-bold"
                  >
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-between">
                  <span className="text-black font-bold">Total Amount:</span>
                  <span className="text-base font-extrabold text-black font-mono">
                    {storeSettings.currency}{calculateTotalBill().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-black font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Record & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

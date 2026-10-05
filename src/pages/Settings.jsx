import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Store,
  Database,
  Download,
  Upload,
  RotateCcw,
  Building2,
  Phone,
  Mail,
  MapPin,
  Receipt,
  Percent,
  Coins,
  FileText,
  Check
} from 'lucide-react';

export const Settings = () => {
  const {
    storeSettings,
    setStoreSettings,
    exportDatabaseJson,
    importDatabaseJson,
    resetToDefaultData,
    notify
  } = useApp();

  const [formData, setFormData] = useState(storeSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoreSettings(formData);
    notify('Store settings updated successfully!', 'success');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        importDatabaseJson(json);
      } catch (err) {
        notify('Invalid backup JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl pb-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-slate-50 to-pink-50 border border-slate-200 p-4 sm:p-5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500 text-white shadow-xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black">
              Store Profile &amp; Settings
            </h2>
            <p className="text-xs font-semibold text-black">
              Manage store contact information, invoice headers, tax rates and data backups
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-4">
        {/* Card 1: Store Contact Details */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Store className="w-4 h-4 text-sky-600" />
            <h3 className="font-extrabold text-black text-sm">Store Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-black font-bold mb-1">
                Store / Business Name <span className="text-rose-600 font-extrabold">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. MobiPulse Mobile Store"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-black font-bold mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Premium Smartphones & Accessories"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-black font-bold mb-1">
                Phone Number <span className="text-rose-600 font-extrabold">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-black font-bold mb-1">
                Email Address <span className="text-rose-600 font-extrabold">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. store@mobipulse.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-black font-bold mb-1">Store Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                placeholder="Shop No, Street, Landmark, City, State, PIN"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Billing, Tax & Invoices */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Receipt className="w-4 h-4 text-pink-600" />
            <h3 className="font-extrabold text-black text-sm">Invoice &amp; Tax Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-black font-bold mb-1">GSTIN / Tax ID</label>
              <input
                type="text"
                placeholder="e.g. 29AABCS1429B1Z8"
                value={formData.gstNumber || ''}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-mono font-bold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs uppercase"
              />
            </div>

            <div>
              <label className="block text-black font-bold mb-1">Default GST Rate (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="18"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-black font-bold mb-1">Currency Symbol</label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="₹"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-bold font-mono focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-black font-bold mb-1">Terms &amp; Conditions (Printed on Invoices)</label>
            <textarea
              rows={3}
              placeholder="Enter standard invoice terms..."
              value={formData.termsAndConditions || ''}
              onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-medium focus:outline-none focus:border-sky-500 focus:bg-white shadow-2xs resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </form>

      {/* Database Backup & Restore */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Database className="w-4 h-4 text-pink-500" />
          <h3 className="font-extrabold text-black text-sm">Data Backup &amp; Reset</h3>
        </div>

        <p className="text-black font-semibold">
          Your inventory, sales, and customer data are securely stored locally. You can export a JSON backup file or restore anytime.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={exportDatabaseJson}
            className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Download Backup (JSON)</span>
          </button>

          <label className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-pink-700" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to reset all data back to the demo store baseline?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl font-bold transition flex items-center gap-1.5 ml-auto shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

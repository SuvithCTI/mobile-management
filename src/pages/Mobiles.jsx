import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Plus,
  Minus,
  Search,
  Edit2,
  Trash2,
  X,
  PlusCircle,
  Copy,
  Sparkles,
  Image as ImageIcon,
  Check,
  Layers,
  Tag,
  Boxes,
  Upload,
  Camera
} from 'lucide-react';

const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const Mobiles = () => {
  const { mobiles, brands, storeSettings, addMobile, updateMobile, deleteMobile, notify, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMobile, setEditingMobile] = useState(null);

  // Modal IMEI inline state
  const [modalImeis, setModalImeis] = useState([]);
  const [inlineImei1, setInlineImei1] = useState('');
  const [inlineImei2, setInlineImei2] = useState('');
  const [inlineSerial, setInlineSerial] = useState('');
  const [bulkImeisText, setBulkImeisText] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const [formData, setFormData] = useState({
    brand: 'Apple',
    model: '',
    color: 'Desert Titanium',
    ram: '8 GB',
    storage: '256 GB',
    category: 'Flagship Smartphones',
    buyPrice: '',
    sellPrice: '',
    warrantyMonths: 12,
    minStockAlert: 2,
    image: '',
    images: []
  });

  const handleImageFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImages = formData.images || [];
    const remainingSlots = 5 - currentImages.length;
    if (remainingSlots <= 0) {
      notify('Maximum 5 images allowed', 'error');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const newImages = [];

    for (const file of filesToProcess) {
      try {
        const dataUrl = await processImageFile(file);
        newImages.push(dataUrl);
      } catch (err) {
        console.error('Image upload error', err);
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...currentImages, ...newImages].slice(0, 5);
      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
        image: updatedImages[0] || prev.image
      }));
      notify(`Added ${newImages.length} photo(s) directly from device`);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = (formData.images || []).filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
      image: updatedImages[0] || ''
    }));
  };

  const handleSetPrimaryImage = (indexToPrimary) => {
    const current = [...(formData.images || [])];
    if (indexToPrimary >= 0 && indexToPrimary < current.length) {
      const [selected] = current.splice(indexToPrimary, 1);
      const reordered = [selected, ...current];
      setFormData((prev) => ({
        ...prev,
        images: reordered,
        image: reordered[0]
      }));
      notify('Set as cover image');
    }
  };

  const inStockCount = modalImeis.filter((i) => i.status === 'in_stock').length;

  const handleSetStockCount = (target) => {
    const targetCount = Math.max(0, parseInt(target, 10) || 0);
    const inStockUnits = modalImeis.filter((i) => i.status === 'in_stock');
    const soldUnits = modalImeis.filter((i) => i.status === 'sold');
    const diff = targetCount - inStockUnits.length;

    if (diff > 0) {
      const added = Array.from({ length: diff }, () => ({
        imei1: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        imei2: '',
        serial: `SN${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'in_stock',
        dateAdded: new Date().toISOString().split('T')[0]
      }));
      setModalImeis([...added, ...modalImeis]);
      notify(`Stock updated to ${targetCount} units`);
    } else if (diff < 0) {
      const toKeepCount = inStockUnits.length + diff;
      const keptInStock = inStockUnits.slice(0, Math.max(0, toKeepCount));
      setModalImeis([...keptInStock, ...soldUnits]);
      notify(`Stock updated to ${targetCount} units`);
    }
  };

  const isAdmin = currentUser?.role === 'Admin';

  const filteredMobiles = mobiles.filter((mob) => {
    const matchesSearch =
      mob.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mob.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mob.imeis && mob.imeis.some((i) => i.imei1?.includes(searchQuery)));
    const matchesBrand = selectedBrand === 'All' || mob.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleOpenAdd = () => {
    setFormData({
      brand: brands[0]?.name || 'Apple',
      model: '',
      color: 'Titanium Gray',
      ram: '8 GB',
      storage: '256 GB',
      category: 'Smartphones',
      buyPrice: '',
      sellPrice: '',
      warrantyMonths: 12,
      minStockAlert: 2,
      image: '',
      images: []
    });
    setModalImeis([]);
    setInlineImei1('');
    setInlineImei2('');
    setInlineSerial('');
    setBulkImeisText('');
    setShowBulkInput(false);
    setEditingMobile(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (mob) => {
    const imgList = (mob.images && mob.images.length > 0) ? [...mob.images] : (mob.image ? [mob.image] : []);
    setFormData({
      brand: mob.brand,
      model: mob.model,
      color: mob.color,
      ram: mob.ram,
      storage: mob.storage,
      category: mob.category || 'Smartphones',
      buyPrice: mob.buyPrice,
      sellPrice: mob.sellPrice,
      warrantyMonths: mob.warrantyMonths || 12,
      minStockAlert: mob.minStockAlert || 2,
      image: mob.image || imgList[0] || '',
      images: imgList
    });
    setModalImeis(mob.imeis ? [...mob.imeis] : []);
    setInlineImei1('');
    setInlineImei2('');
    setInlineSerial('');
    setBulkImeisText('');
    setShowBulkInput(false);
    setEditingMobile(mob);
    setIsAddModalOpen(true);
  };

  const handleAddInlineImei = (e) => {
    e.preventDefault();
    if (!inlineImei1.trim()) {
      notify('Please enter primary IMEI 1', 'error');
      return;
    }
    const clean1 = inlineImei1.trim();
    if (modalImeis.some((i) => i.imei1 === clean1)) {
      notify('This IMEI 1 is already in the list', 'error');
      return;
    }

    const newUnit = {
      imei1: clean1,
      imei2: inlineImei2.trim(),
      serial: inlineSerial.trim() || `SN${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'in_stock',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setModalImeis((prev) => [newUnit, ...prev]);
    setInlineImei1('');
    setInlineImei2('');
    setInlineSerial('');
    notify('IMEI unit added to list');
  };

  const handleApplyBulkImeis = () => {
    if (!bulkImeisText.trim()) return;
    const lines = bulkImeisText.split('\n').filter((l) => l.trim().length > 0);
    const addedUnits = [];

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      const im1 = parts[0] || `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
      if (!modalImeis.some((i) => i.imei1 === im1) && !addedUnits.some((u) => u.imei1 === im1)) {
        addedUnits.push({
          imei1: im1,
          imei2: parts[1] || '',
          serial: parts[2] || `SN${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'in_stock',
          dateAdded: new Date().toISOString().split('T')[0]
        });
      }
    });

    if (addedUnits.length > 0) {
      setModalImeis((prev) => [...addedUnits, ...prev]);
      setBulkImeisText('');
      setShowBulkInput(false);
      notify(`Added ${addedUnits.length} IMEI units`);
    } else {
      notify('No new valid IMEIs found', 'info');
    }
  };

  const handleRemoveModalImei = (imei1ToRemove) => {
    setModalImeis((prev) => prev.filter((i) => i.imei1 !== imei1ToRemove));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.model || !formData.sellPrice) {
      notify('Model name and Selling Price are required', 'error');
      return;
    }

    const finalImages = (formData.images && formData.images.length > 0)
      ? formData.images.slice(0, 5)
      : (formData.image ? [formData.image] : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80']);
    const primaryImage = finalImages[0];

    const mobilePayload = {
      ...formData,
      image: primaryImage,
      images: finalImages,
      buyPrice: Number(formData.buyPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      warrantyMonths: Number(formData.warrantyMonths) || 12,
      minStockAlert: Number(formData.minStockAlert) || 2,
      imeis: modalImeis
    };

    if (editingMobile) {
      updateMobile(editingMobile.id, mobilePayload);
    } else {
      addMobile(mobilePayload);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Colorful Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-pink-50 to-slate-50 border border-sky-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-black">
                Smartphones <span className="text-sky-700 font-extrabold">Inventory</span>
              </h2>
              <p className="text-xs font-semibold text-black">Track dual IMEI serials, storage specs & retail pricing</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Smartphone
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, brand, or IMEI..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="bg-slate-50 border border-slate-300 text-black font-bold py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:border-sky-500"
        >
          <option value="All">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Mobiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMobiles.map((mob) => {
          const inStockUnits = (mob.imeis || []).filter((i) => i.status === 'in_stock');
          const isLow = inStockUnits.length <= (mob.minStockAlert || 2);

          return (
            <div
              key={mob.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:border-sky-300 transition"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={mob.image}
                    alt={mob.model}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-sky-50 text-sky-800 border border-sky-200 uppercase">
                      {mob.brand}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-md border ${
                        isLow ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {inStockUnits.length} in stock
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-black truncate mt-1.5">{mob.model}</h3>
                  <p className="text-[11px] font-semibold text-black">{mob.ram} / {mob.storage} • {mob.color}</p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-black font-bold uppercase block">Selling Price</span>
                  <span className="text-sm font-extrabold text-black font-mono">
                    {storeSettings.currency}{mob.sellPrice?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(mob)}
                        className="p-1.5 text-black hover:text-sky-600 rounded-lg hover:bg-sky-50 transition"
                        title="Edit smartphone"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${mob.brand} ${mob.model}?`)) deleteMobile(mob.id);
                        }}
                        className="p-1.5 text-black hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete smartphone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Add / Edit Smartphone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs p-3 sm:p-6 flex justify-center items-start animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 text-xs my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-black text-sm sm:text-base">
                    {editingMobile ? `Edit Smartphone: ${editingMobile.model}` : 'Add New Smartphone'}
                  </h3>
                  <p className="text-[11px] text-black font-semibold">
                    Configure specifications, image URL & preview, pricing, and IMEI units
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-black hover:text-rose-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* Section 1: Basic Specifications */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">
                  1. Specifications & Identification
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">Brand</label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold focus:border-sky-500 focus:outline-none"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">Model Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 16 Pro Max / Galaxy S24 Ultra"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-black mb-1 font-bold text-[10px]">RAM</label>
                    <input
                      type="text"
                      placeholder="e.g. 8 GB"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[10px]">Storage</label>
                    <input
                      type="text"
                      placeholder="e.g. 256 GB"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[10px]">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Desert Titanium"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-black font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Stock Inventory */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">
                  2. Pricing & Stock Inventory
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">Cost / Buy Price</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-black font-mono">
                        {storeSettings.currency}
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.buyPrice}
                        onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-6 pr-2.5 py-1.5 text-black font-mono font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">Retail / Sell Price *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-black font-mono">
                        {storeSettings.currency}
                      </span>
                      <input
                        type="number"
                        required
                        placeholder="0"
                        value={formData.sellPrice}
                        onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-6 pr-2.5 py-1.5 text-black font-mono font-extrabold focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">
                      Stock in Inventory *
                    </label>
                    <div className="flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleSetStockCount(inStockCount - 1)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-black font-bold border-r border-slate-300 transition cursor-pointer"
                        title="Reduce stock"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={inStockCount}
                        onChange={(e) => handleSetStockCount(e.target.value)}
                        className="w-full text-center py-1.5 text-black font-mono font-extrabold text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSetStockCount(inStockCount + 1)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-black font-bold border-l border-slate-300 transition cursor-pointer"
                        title="Add stock"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-black mb-1 font-bold text-[11px]">Warranty (Months)</label>
                    <input
                      type="number"
                      placeholder="12"
                      value={formData.warrantyMonths}
                      onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Product Photos (Direct Upload Up to 5 Images) */}
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-[11px] font-extrabold text-black uppercase tracking-wider">
                      3. Product Photos ({formData.images?.length || 0}/5 Images)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">
                    Direct Upload • Up to 5 Photos
                  </span>
                </div>

                {/* 5-Slot Image Grid (Reduced Height) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(formData.images || []).map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`relative group h-16 rounded-xl border bg-white p-1 flex items-center justify-center overflow-hidden transition ${
                        idx === 0
                          ? 'border-sky-500 ring-2 ring-sky-200 shadow-2xs'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Photo ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80";
                        }}
                      />

                      {/* Cover Badge or Set Cover Button */}
                      {idx === 0 ? (
                        <span className="absolute top-0.5 left-0.5 bg-sky-600 text-white text-[8px] font-extrabold px-1 rounded shadow-2xs">
                          ★ Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-sky-600 text-white text-[8px] font-bold px-1 rounded transition shadow-2xs cursor-pointer"
                          title="Make Primary Cover"
                        >
                          Cover
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded transition shadow-2xs cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}

                  {/* Direct Upload Slot if < 5 */}
                  {(formData.images?.length || 0) < 5 && (
                    <label className="h-16 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-50 flex flex-col items-center justify-center cursor-pointer transition p-1 text-center group">
                      <Upload className="w-4 h-4 text-sky-600 group-hover:scale-110 transition" />
                      <span className="text-[9px] font-bold text-sky-900 mt-0.5">
                        + Add Photo
                      </span>
                      <span className="text-[8px] font-semibold text-slate-500">
                        {(5 - (formData.images?.length || 0))} left
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9.5px] text-slate-600 font-semibold gap-1 px-0.5">
                  <span>💡 Select photos directly from your device.</span>
                  <span className="text-sky-800 font-bold">First photo (★ Cover) is used on cards & invoices.</span>
                </div>
              </div>

              {/* Section 4: IMEI & Serial Number Inventory */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-black uppercase tracking-wider block">
                      4. IMEI & Serial Registry ({modalImeis.length} Units)
                    </span>
                    <span className="text-[10px] font-semibold text-black">
                      {modalImeis.filter((i) => i.status === 'in_stock').length} units in stock ready for sale
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="text-[11px] font-bold text-sky-800 hover:text-sky-900 underline cursor-pointer"
                  >
                    {showBulkInput ? 'Switch to Single Entry' : '+ Bulk Paste IMEIs'}
                  </button>
                </div>

                {showBulkInput ? (
                  <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-300">
                    <label className="block text-[10px] font-bold text-black">
                      Paste IMEIs (Format: IMEI1, IMEI2, Serial per line):
                    </label>
                    <textarea
                      rows={3}
                      placeholder={"359124089123451, 359124089123452, SN98410\n359124089123453, 359124089123454, SN98411"}
                      value={bulkImeisText}
                      onChange={(e) => setBulkImeisText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-black font-mono text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkImeis}
                      className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Import Paged IMEIs
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-black mb-0.5">Primary IMEI 1 *</label>
                        <input
                          type="text"
                          placeholder="3591240891..."
                          value={inlineImei1}
                          onChange={(e) => setInlineImei1(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-black font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-black mb-0.5">Secondary IMEI 2</label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={inlineImei2}
                          onChange={(e) => setInlineImei2(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-black font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-black mb-0.5">Serial Number</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="SN..."
                            value={inlineSerial}
                            onChange={(e) => setInlineSerial(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-black font-mono font-bold text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddInlineImei}
                            className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold text-xs shrink-0 transition cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Units List */}
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 p-1.5">
                  {modalImeis.length === 0 ? (
                    <div className="py-4 text-center text-black font-bold text-xs">
                      No IMEIs registered yet. Add at least 1 unit above.
                    </div>
                  ) : (
                    modalImeis.map((unit, idx) => (
                      <div key={idx} className="pt-1 pb-1 flex items-center justify-between text-xs px-2 hover:bg-slate-50">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="font-extrabold text-black">{unit.imei1}</span>
                          {unit.imei2 && <span className="text-black text-[10px] font-semibold">({unit.imei2})</span>}
                          {unit.serial && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-black rounded border border-slate-300">
                              SN: {unit.serial}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] px-2 py-0.2 rounded-full font-bold border ${
                              unit.status === 'in_stock'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {unit.status === 'in_stock' ? 'In Stock' : 'Sold'}
                          </span>
                          {unit.status !== 'sold' && (
                            <button
                              type="button"
                              onClick={() => handleRemoveModalImei(unit.imei1)}
                              className="p-1 text-black hover:text-rose-600 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Smartphone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

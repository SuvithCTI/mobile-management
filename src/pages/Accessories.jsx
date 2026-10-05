import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Headphones,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
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

export const Accessories = () => {
  const { accessories, brands, categories, storeSettings, addAccessory, updateAccessory, deleteAccessory, notify, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);

  const isAdmin = currentUser?.role === 'Admin';

  const defaultAccImg = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80';

  const [formData, setFormData] = useState({
    name: '',
    category: 'Fast Chargers & Adapters',
    brand: 'Apple',
    buyPrice: '',
    sellPrice: '',
    stockCount: 10,
    minStockAlert: 4,
    warrantyMonths: 12,
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
      notify('Set as cover photo');
    }
  };

  const accessoryCategories = categories.filter((c) => c.type === 'accessory' || !c.type);

  const filteredAccessories = accessories.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || acc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: accessoryCategories[0]?.name || 'Fast Chargers & Adapters',
      brand: brands[0]?.name || 'Spigen',
      buyPrice: '',
      sellPrice: '',
      stockCount: 10,
      minStockAlert: 4,
      warrantyMonths: 12,
      image: '',
      images: []
    });
    setEditingAcc(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    const imgList = (acc.images && acc.images.length > 0) ? [...acc.images] : (acc.image ? [acc.image] : []);
    setFormData({
      name: acc.name,
      category: acc.category,
      brand: acc.brand,
      buyPrice: acc.buyPrice,
      sellPrice: acc.sellPrice,
      stockCount: acc.stockCount,
      minStockAlert: acc.minStockAlert,
      warrantyMonths: acc.warrantyMonths,
      image: acc.image || imgList[0] || '',
      images: imgList
    });
    setEditingAcc(acc);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sellPrice) {
      notify('Name and Selling Price are required', 'error');
      return;
    }

    const finalImages = (formData.images && formData.images.length > 0)
      ? formData.images.slice(0, 5)
      : (formData.image ? [formData.image] : [defaultAccImg]);
    const primaryImage = finalImages[0];

    const payload = {
      ...formData,
      image: primaryImage,
      images: finalImages,
      buyPrice: Number(formData.buyPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      stockCount: Number(formData.stockCount) || 0
    };

    if (editingAcc) {
      updateAccessory(editingAcc.id, payload);
    } else {
      addAccessory(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-50 via-sky-50 to-slate-50 border border-pink-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500 text-white shadow-xs shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black leading-tight">
              Accessories <span className="text-pink-700 font-extrabold">Catalog</span>
            </h2>
            <p className="text-xs font-semibold text-black">Chargers, Earbuds, Cases &amp; Protectors</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Add Accessory</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accessories..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-300 text-black font-bold py-1.5 px-3 rounded-xl text-xs focus:outline-none focus:border-pink-500"
        >
          <option value="All">All Categories</option>
          {accessoryCategories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredAccessories.map((acc) => {
          const isLow = (acc.stockCount || 0) <= (acc.minStockAlert || 4);
          return (
            <div
              key={acc.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs p-3.5 flex flex-col justify-between space-y-2.5 hover:border-pink-300 transition"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-50 text-pink-800 border border-pink-200 uppercase">
                    {acc.brand}
                  </span>
                  <h3 className="text-xs font-bold text-black line-clamp-2 mt-1">{acc.name}</h3>
                  <span
                    className={`inline-block text-[10px] font-bold mt-1 px-1.5 py-0.2 rounded border ${
                      isLow ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-100 text-black border-slate-300'
                    }`}
                  >
                    {acc.stockCount} in stock
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-extrabold text-black font-mono">
                  {storeSettings.currency}{acc.sellPrice?.toLocaleString()}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(acc)}
                      className="p-1 text-black hover:text-pink-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${acc.name}?`)) deleteAccessory(acc.id);
                      }}
                      className="p-1 text-black hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-black">
                {editingAcc ? 'Edit Accessory' : 'Add Accessory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-black mb-0.5 font-bold">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20W USB-C Adapter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-black mb-0.5 font-bold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                  >
                    {accessoryCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-black mb-0.5 font-bold">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-bold"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-black mb-0.5 font-bold">Selling Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-mono font-extrabold"
                  />
                </div>
                <div>
                  <label className="block text-black mb-0.5 font-bold">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-black font-mono font-bold"
                  />
                </div>
              </div>

              {/* Direct Photo Upload (Up to 5 images) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-pink-600" />
                    <span className="text-[11px] font-extrabold text-black uppercase tracking-wider">
                      Product Photos ({formData.images?.length || 0}/5)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">
                    Max 5 Photos
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {(formData.images || []).map((imgSrc, idx) => (
                    <div
                      key={idx}
                      className={`relative group h-16 rounded-xl border bg-white p-0.5 flex items-center justify-center overflow-hidden transition ${
                        idx === 0
                          ? 'border-pink-500 ring-2 ring-pink-200'
                          : 'border-slate-300'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Photo ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultAccImg;
                        }}
                      />

                      {idx === 0 ? (
                        <span className="absolute top-0.5 left-0.5 bg-pink-600 text-white text-[8px] font-extrabold px-1 rounded shadow-2xs">
                          ★
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-pink-600 text-white text-[8px] font-bold px-1 rounded transition cursor-pointer"
                          title="Set as Cover"
                        >
                          ★
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 bg-rose-600 hover:bg-rose-700 text-white p-0.5 rounded transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}

                  {(formData.images?.length || 0) < 5 && (
                    <label className="h-16 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/50 hover:bg-pink-50 flex flex-col items-center justify-center cursor-pointer transition p-1 text-center group">
                      <Upload className="w-4 h-4 text-pink-600 group-hover:scale-110 transition" />
                      <span className="text-[9px] font-bold text-pink-900 mt-0.5">
                        + Add
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
                  className="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl"
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

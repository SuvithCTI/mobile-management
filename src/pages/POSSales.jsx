import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Smartphone,
  Headphones,
  Receipt,
  X,
  Check,
  Tag,
  User,
  ArrowLeft,
  CreditCard,
  Percent
} from 'lucide-react';

export const POSSales = ({ onOpenInvoice }) => {
  const {
    mobiles,
    accessories,
    storeSettings,
    createSale,
    notify
  } = useApp();

  const [activeCatalogTab, setActiveCatalogTab] = useState('mobiles');
  const [mobileViewTab, setMobileViewTab] = useState('catalog'); // 'catalog' | 'cart'
  const [productSearch, setProductSearch] = useState('');

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [flatDiscount, setFlatDiscount] = useState('');

  const [imeiSelectModal, setImeiSelectModal] = useState(null);

  const filteredMobiles = mobiles.filter((m) => {
    const inStock = (m.imeis || []).filter((i) => i.status === 'in_stock').length;
    const matches =
      m.model.toLowerCase().includes(productSearch.toLowerCase()) ||
      m.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matches && inStock > 0;
  });

  const filteredAccessories = accessories.filter((a) => {
    const matches =
      a.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      a.brand.toLowerCase().includes(productSearch.toLowerCase());
    return matches && (a.stockCount || 0) > 0;
  });

  const handleSelectMobileForCart = (mobile) => {
    const availableImeis = (mobile.imeis || []).filter((i) => i.status === 'in_stock');
    if (availableImeis.length === 0) {
      notify('Selected mobile is out of stock', 'error');
      return;
    }

    setImeiSelectModal({
      mobile,
      availableImeis,
      selectedImeis: [availableImeis[0].imei1]
    });
  };

  const confirmAddMobileToCart = () => {
    if (!imeiSelectModal || imeiSelectModal.selectedImeis.length === 0) {
      notify('Select at least one IMEI unit', 'error');
      return;
    }

    const { mobile, selectedImeis } = imeiSelectModal;
    const qty = selectedImeis.length;
    const name = mobile.model.toLowerCase().startsWith(mobile.brand.toLowerCase())
      ? `${mobile.model} (${mobile.ram}/${mobile.storage})`
      : `${mobile.brand} ${mobile.model} (${mobile.ram}/${mobile.storage})`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.itemId === mobile.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].imeis = Array.from(new Set([...updated[existingIdx].imeis, ...selectedImeis]));
        updated[existingIdx].qty = updated[existingIdx].imeis.length;
        updated[existingIdx].total = updated[existingIdx].qty * updated[existingIdx].unitPrice;
        return updated;
      } else {
        return [
          ...prev,
          {
            type: 'mobile',
            itemId: mobile.id,
            name,
            unitPrice: mobile.sellPrice,
            qty,
            imeis: selectedImeis,
            warrantyMonths: mobile.warrantyMonths || 12,
            discount: 0,
            total: qty * mobile.sellPrice
          }
        ];
      }
    });

    setImeiSelectModal(null);
    notify(`Added ${qty} unit(s) to Bill Register`, 'success');
  };

  const handleAddAccessoryToCart = (acc) => {
    const accName = acc.name.toLowerCase().startsWith(acc.brand.toLowerCase())
      ? acc.name
      : `${acc.brand} ${acc.name}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.itemId === acc.id);
      if (existing) {
        if (existing.qty >= acc.stockCount) {
          notify(`Only ${acc.stockCount} in stock`, 'error');
          return prev;
        }
        return prev.map((item) =>
          item.itemId === acc.id
            ? { ...item, qty: item.qty + 1, total: (item.qty + 1) * item.unitPrice }
            : item
        );
      } else {
        return [
          ...prev,
          {
            type: 'accessory',
            itemId: acc.id,
            name: accName,
            unitPrice: acc.sellPrice,
            qty: 1,
            imeis: [],
            warrantyMonths: acc.warrantyMonths || 6,
            discount: 0,
            total: acc.sellPrice
          }
        ];
      }
    });
    notify(`Added ${acc.name} to Bill`, 'success');
  };

  const updateCartQty = (itemId, change) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.itemId === itemId) {
            if (item.type === 'mobile') return item;
            const newQty = item.qty + change;
            if (newQty <= 0) return null;
            return { ...item, qty: newQty, total: newQty * item.unitPrice };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
    notify('Item removed from cart', 'info');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountVal = Number(flatDiscount) || 0;
  const grandTotal = Math.max(0, subtotal - discountVal);
  const gstPercentage = storeSettings.taxRate || 18;
  const gstAmount = grandTotal * (gstPercentage / (100 + gstPercentage));
  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCompleteSale = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) {
      notify('Please select products to bill', 'error');
      setMobileViewTab('catalog');
      return;
    }

    if (!customerName.trim()) {
      notify('Please enter Customer Name', 'error');
      return;
    }

    if (!customerPhone.trim()) {
      notify('Please enter Phone / Mobile Number', 'error');
      return;
    }

    if (!customerEmail.trim()) {
      notify('Please enter Gmail / Email address', 'error');
      return;
    }

    if (!customerAddress.trim()) {
      notify('Please enter Customer Address', 'error');
      return;
    }

    const saleRecord = createSale({
      customer: {
        id: null,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim(),
        address: customerAddress.trim()
      },
      items: cart,
      paymentMethod,
      discountAmount: discountVal,
      notes: ''
    });

    setCart([]);
    setFlatDiscount('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerAddress('');
    setMobileViewTab('catalog');

    if (saleRecord && onOpenInvoice) {
      onOpenInvoice(saleRecord);
    }
  };

  return (
    <div className="animate-fade-in pb-12 sm:pb-8">
      {/* Mobile-Only Top View Switcher */}
      <div className="lg:hidden flex items-center bg-slate-200/90 p-1 rounded-2xl shadow-2xs mb-3 border border-slate-300">
        <button
          type="button"
          onClick={() => setMobileViewTab('catalog')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            mobileViewTab === 'catalog'
              ? 'bg-white text-black shadow-xs'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          <Smartphone className="w-4 h-4 text-sky-600" />
          <span>Product Catalog</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('cart')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer relative ${
            mobileViewTab === 'cart'
              ? 'bg-white text-black shadow-xs'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          <Receipt className="w-4 h-4 text-[#701F47]" />
          <span>Bill &amp; Checkout</span>
          {totalCartCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#701F47] text-white text-[10px] font-black ml-0.5">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Left Column: Product Selection - 7 cols */}
        <div className={`lg:col-span-7 space-y-3 ${mobileViewTab === 'cart' ? 'hidden lg:block' : 'block'}`}>
          {/* Catalog Filter Controls */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-2.5 sm:gap-3 shadow-2xs">
            <div className="flex bg-slate-100 rounded-xl p-1 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('mobiles')}
                className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer text-xs ${
                  activeCatalogTab === 'mobiles' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-700 hover:text-black'
                }`}
              >
                Smartphones
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('accessories')}
                className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer text-xs ${
                  activeCatalogTab === 'accessories' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-700 hover:text-black'
                }`}
              >
                Accessories
              </button>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search catalog..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:max-h-[620px] lg:overflow-y-auto pr-0.5">
            {activeCatalogTab === 'mobiles' ? (
              filteredMobiles.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs bg-white rounded-2xl border border-slate-200">
                  No matching smartphones found in stock
                </div>
              ) : (
                filteredMobiles.map((mob) => {
                  const inStock = (mob.imeis || []).filter((i) => i.status === 'in_stock').length;
                  return (
                    <div
                      key={mob.id}
                      onClick={() => handleSelectMobileForCart(mob)}
                      className="p-2.5 sm:p-3 bg-white hover:bg-sky-50/40 border border-slate-200 hover:border-sky-400 rounded-2xl transition duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md group relative"
                    >
                      {/* Image Container with Top Badges */}
                      <div className="relative flex items-center justify-center h-24 sm:h-28 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-xl p-2 pt-6 mb-2 border border-slate-200/80 overflow-hidden">
                        <div className="absolute top-1.5 left-0 right-0 px-1.5 flex items-center justify-between gap-1 z-10">
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/95 text-sky-900 border border-slate-200 shadow-2xs truncate max-w-[75px] sm:max-w-[95px]">
                            {mob.brand}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs shrink-0 ${
                              inStock <= 2
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {inStock} left
                          </span>
                        </div>
                        <img
                          src={mob.image}
                          alt={mob.model}
                          className="max-h-full max-w-full object-contain drop-shadow group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                      </div>

                      {/* Info & Specs */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-black truncate group-hover:text-sky-900 transition leading-tight">
                          {mob.model}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-600 truncate mt-0.5">
                          {mob.ram}/{mob.storage} • {mob.color}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-extrabold text-black font-mono truncate">
                          {storeSettings.currency}{mob.sellPrice?.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-[10px] font-extrabold transition shadow-2xs shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              filteredAccessories.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs bg-white rounded-2xl border border-slate-200">
                  No matching accessories found in stock
                </div>
              ) : (
                filteredAccessories.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleAddAccessoryToCart(acc)}
                    className="p-2.5 sm:p-3 bg-white hover:bg-pink-50/40 border border-slate-200 hover:border-pink-400 rounded-2xl transition duration-200 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md group relative"
                  >
                    {/* Image Container with Top Badges */}
                    <div className="relative flex items-center justify-center h-24 sm:h-28 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-xl p-2 pt-6 mb-2 border border-slate-200/80 overflow-hidden">
                      <div className="absolute top-1.5 left-0 right-0 px-1.5 flex items-center justify-between gap-1 z-10">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/95 text-pink-900 border border-slate-200 shadow-2xs truncate max-w-[75px] sm:max-w-[95px]">
                          {acc.brand}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs shrink-0 ${
                            acc.stockCount <= 3
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {acc.stockCount} left
                        </span>
                      </div>
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="max-h-full max-w-full object-contain drop-shadow group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </div>

                    {/* Info & Category */}
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-black truncate group-hover:text-pink-900 transition leading-tight">
                        {acc.name}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-600 truncate mt-0.5">
                        {acc.category}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-sm font-extrabold text-black font-mono truncate">
                        {storeSettings.currency}{acc.sellPrice?.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-[10px] font-extrabold transition shadow-2xs shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Right Column: Cart Register - 5 cols */}
        <div
          id="pos-cart-section"
          className={`lg:col-span-5 bg-white border border-slate-200 rounded-3xl shadow-sm p-4 sm:p-5 flex flex-col space-y-4 ${
            mobileViewTab === 'catalog' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-[#701F47] border border-sky-200">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-black text-sm">Bill Register</h3>
                <p className="text-[10px] font-bold text-slate-500">
                  {totalCartCount} item(s) selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileViewTab('catalog')}
                className="lg:hidden text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </button>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-700" />
                Customer Details
              </span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
                Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-800 mb-1">
                  Customer Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Malhotra"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-black font-bold placeholder-slate-400 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-800 mb-1">
                  Phone / Mobile Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="+91 98450 11223"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-black font-bold placeholder-slate-400 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-800 mb-1">
                  Gmail / Email <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="customer@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-black font-semibold placeholder-slate-400 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-800 mb-1">
                  Customer Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Street / City address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-black font-semibold placeholder-slate-400 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-black text-black uppercase tracking-wider">
              Selected Items ({totalCartCount})
            </h4>

            <div className="lg:max-h-52 lg:overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
              {cart.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ShoppingCart className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-slate-600 font-bold text-xs">No items added to bill yet</p>
                  <button
                    type="button"
                    onClick={() => setMobileViewTab('catalog')}
                    className="mt-2 text-xs font-extrabold text-sky-600 hover:text-sky-800 underline cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.itemId} className="pt-2 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 pr-1">
                      <h5 className="font-extrabold text-black text-xs leading-tight truncate">{item.name}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-600 font-mono font-bold">
                          {item.qty} × {storeSettings.currency}{item.unitPrice?.toLocaleString()}
                        </span>
                        {item.imeis && item.imeis.length > 0 && (
                          <span className="text-[9px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-1.5 rounded">
                            IMEI: {item.imeis.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-black font-mono text-xs">
                        {storeSettings.currency}{item.total?.toLocaleString()}
                      </span>
                      {item.type === 'accessory' && (
                        <div className="flex items-center bg-slate-100 rounded-lg border border-slate-300">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.itemId, -1)}
                            className="px-1.5 py-0.5 text-black font-black hover:bg-slate-200 rounded-l-lg cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-black text-[11px] text-black">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.itemId, 1)}
                            className="px-1.5 py-0.5 text-black font-black hover:bg-slate-200 rounded-r-lg cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.itemId)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment, Discount & Checkout */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-800 font-extrabold text-[10px] mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-black font-bold text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="EMI">EMI Finance / Bajaj</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-[10px] mb-1">
                  Discount Amount ({storeSettings.currency})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={flatDiscount}
                    onChange={(e) => setFlatDiscount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-black font-mono font-bold text-xs focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
                    OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Total Payable Summary Box */}
            <div className="p-3 bg-gradient-to-r from-sky-50 via-slate-50 to-pink-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-black">{storeSettings.currency}{subtotal.toLocaleString()}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex items-center justify-between text-xs text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono font-bold">- {storeSettings.currency}{discountVal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                <span className="text-black font-black text-xs sm:text-sm">Total Payable:</span>
                <span className="text-base sm:text-lg text-[#701F47] font-mono font-black">
                  {storeSettings.currency}{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              type="button"
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-3 bg-[#701F47] hover:bg-[#5c193a] active:scale-[0.99] disabled:opacity-40 text-white font-black text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Complete Sale &amp; Print Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium IMEI Selection Modal */}
      {imeiSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md sm:max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 sm:p-5 space-y-3.5 my-auto max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-sky-100 text-sky-900 rounded border border-sky-200">
                      {imeiSelectModal.mobile.brand}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      {imeiSelectModal.availableImeis.length} Units Available
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-black mt-0.5 truncate">
                    Select IMEI: {imeiSelectModal.mobile.model}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold truncate">
                    {imeiSelectModal.mobile.ram} / {imeiSelectModal.mobile.storage} • {imeiSelectModal.mobile.color}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImeiSelectModal(null)}
                className="p-1.5 text-slate-500 hover:text-black rounded-xl hover:bg-slate-100 transition shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select Actions (Select All / Clear) */}
            <div className="flex items-center justify-between text-xs px-1 shrink-0">
              <span className="font-bold text-black text-[11px]">
                Choose IMEI unit(s) to add to invoice:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImeiSelectModal({
                      ...imeiSelectModal,
                      selectedImeis: imeiSelectModal.availableImeis.map((u) => u.imei1)
                    });
                  }}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-800 underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setImeiSelectModal({
                      ...imeiSelectModal,
                      selectedImeis: []
                    });
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* IMEI List with Responsive Cards */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-64">
              {imeiSelectModal.availableImeis.map((unit, idx) => {
                const isSelected = imeiSelectModal.selectedImeis.includes(unit.imei1);
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setImeiSelectModal({
                          ...imeiSelectModal,
                          selectedImeis: imeiSelectModal.selectedImeis.filter((i) => i !== unit.imei1)
                        });
                      } else {
                        setImeiSelectModal({
                          ...imeiSelectModal,
                          selectedImeis: [...imeiSelectModal.selectedImeis, unit.imei1]
                        });
                      }
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 sm:gap-3 ${
                      isSelected
                        ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-200 text-black shadow-2xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 transition-all ${
                          isSelected
                            ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      {/* IMEI and Serial */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-mono font-extrabold text-black tracking-wide">
                            {unit.imei1}
                          </span>
                          {unit.serial && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                              SN: {unit.serial}
                            </span>
                          )}
                        </div>
                        {unit.imei2 && (
                          <div className="text-[10px] font-mono text-slate-500 font-semibold mt-0.5 truncate">
                            IMEI 2: {unit.imei2}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 self-center">
                      In Stock
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 block">
                  Selected: <span className="text-sky-800 font-extrabold">{imeiSelectModal.selectedImeis.length} Unit(s)</span>
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-black font-mono truncate block">
                  {storeSettings.currency}{(imeiSelectModal.selectedImeis.length * imeiSelectModal.mobile.sellPrice).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setImeiSelectModal(null)}
                  className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAddMobileToCart}
                  disabled={imeiSelectModal.selectedImeis.length === 0}
                  className="px-3.5 sm:px-5 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span>Add to Bill ({imeiSelectModal.selectedImeis.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

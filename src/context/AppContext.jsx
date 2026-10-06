import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  initialStoreSettings,
  initialBrands,
  initialCategories,
  initialMobiles,
  initialAccessories,
  initialCustomers,
  initialSales,
  initialPurchases,
  initialUsers
} from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Helper to load from LocalStorage or fallback to default
  const loadStorage = (key, fallback) => {
    try {
      const stored = localStorage.getItem(`mobi_${key}`);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      
      // Auto-refresh default product images if fallback has newer high-def images
      if (key === 'mobiles' && Array.isArray(parsed)) {
        return parsed.map((item) => {
          const defaultItem = fallback.find((f) => f.id === item.id);
          if (defaultItem && defaultItem.image) {
            return { ...item, image: defaultItem.image };
          }
          return item;
        });
      }
      if (key === 'accessories' && Array.isArray(parsed)) {
        return parsed.map((item) => {
          const defaultItem = fallback.find((f) => f.id === item.id);
          if (defaultItem && defaultItem.image) {
            return { ...item, image: defaultItem.image };
          }
          return item;
        });
      }

      return parsed;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  };

  // State initialization
  const [currentUser, setCurrentUser] = useState(() => loadStorage('currentUser', null));
  const [users, setUsers] = useState(() => {
    const saved = loadStorage('users', initialUsers);
    if (Array.isArray(saved)) {
      return initialUsers.map((u) => {
        const found = saved.find((s) => s.id === u.id);
        return found ? { ...found, email: u.email, password: u.password, username: u.username } : u;
      });
    }
    return initialUsers;
  });
  const [storeSettings, setStoreSettings] = useState(() => loadStorage('settings', initialStoreSettings));
  const [brands, setBrands] = useState(() => loadStorage('brands', initialBrands));
  const [categories, setCategories] = useState(() => loadStorage('categories', initialCategories));
  const [mobiles, setMobiles] = useState(() => loadStorage('mobiles', initialMobiles));
  const [accessories, setAccessories] = useState(() => loadStorage('accessories', initialAccessories));
  const [customers, setCustomers] = useState(() => loadStorage('customers', initialCustomers));
  const [sales, setSales] = useState(() => loadStorage('sales', initialSales));
  const [purchases, setPurchases] = useState(() => loadStorage('purchases', initialPurchases));
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sync back to LocalStorage
  useEffect(() => { localStorage.setItem('mobi_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('mobi_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('mobi_settings', JSON.stringify(storeSettings)); }, [storeSettings]);
  useEffect(() => { localStorage.setItem('mobi_brands', JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem('mobi_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('mobi_mobiles', JSON.stringify(mobiles)); }, [mobiles]);
  useEffect(() => { localStorage.setItem('mobi_accessories', JSON.stringify(accessories)); }, [accessories]);
  useEffect(() => { localStorage.setItem('mobi_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('mobi_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('mobi_purchases', JSON.stringify(purchases)); }, [purchases]);

  // Toast Notification System
  const notify = (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Authentication Helpers (supports email or username matching)
  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.email?.toLowerCase() === cleanId ||
         u.username?.toLowerCase() === cleanId ||
         (cleanId === 'admin' && u.role === 'Admin') ||
         (cleanId === 'staff' && u.role === 'Sales Staff')) &&
        u.password === password
    );
    if (user) {
      setCurrentUser(user);
      notify(`Welcome back, ${user.name}!`, 'success');
      return { success: true, user };
    }
    notify('Invalid email or password', 'error');
    return { success: false };
  };

  const logout = () => {
    setCurrentUser(null);
    notify('Logged out successfully', 'info');
  };

  const switchRole = (role) => {
    const matchedUser = users.find((u) => u.role === role) || {
      id: `u-${Date.now()}`,
      name: role === 'Admin' ? 'Store Admin' : 'Sales Staff',
      username: role.toLowerCase().replace(' ', ''),
      role
    };
    setCurrentUser(matchedUser);
    notify(`Switched to ${role} role mode`);
  };

  // Mobile Handset Management
  const addMobile = (mobileData) => {
    const newMobile = {
      ...mobileData,
      id: `mob-${Date.now()}`,
      imeis: (mobileData.imeis || []).map((im) => ({
        ...im,
        status: 'in_stock',
        dateAdded: new Date().toISOString().split('T')[0]
      }))
    };
    setMobiles((prev) => [newMobile, ...prev]);
    notify(`Added ${newMobile.brand} ${newMobile.model} to inventory!`, 'success');
    return newMobile;
  };

  const updateMobile = (id, updatedData) => {
    setMobiles((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
    notify('Mobile details updated successfully', 'success');
  };

  const deleteMobile = (id) => {
    setMobiles((prev) => prev.filter((m) => m.id !== id));
    notify('Product removed from catalog', 'info');
  };

  const addImeisToMobile = (mobileId, newImeisList) => {
    setMobiles((prev) =>
      prev.map((m) => {
        if (m.id !== mobileId) return m;
        const formattedNew = newImeisList.map((im) => ({
          ...im,
          status: 'in_stock',
          dateAdded: new Date().toISOString().split('T')[0]
        }));
        return {
          ...m,
          imeis: [...(m.imeis || []), ...formattedNew]
        };
      })
    );
    notify(`Added ${newImeisList.length} IMEI unit(s) to stock!`, 'success');
  };

  // Accessories Management
  const addAccessory = (accData) => {
    const newAcc = {
      ...accData,
      id: `acc-${Date.now()}`
    };
    setAccessories((prev) => [newAcc, ...prev]);
    notify(`Added ${newAcc.name} to accessories catalog!`, 'success');
    return newAcc;
  };

  const updateAccessory = (id, updatedData) => {
    setAccessories((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
    );
    notify('Accessory updated', 'success');
  };

  const deleteAccessory = (id) => {
    setAccessories((prev) => prev.filter((a) => a.id !== id));
    notify('Accessory deleted', 'info');
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: `cust-${Date.now()}`,
      points: 0,
      totalPurchases: 0,
      ordersCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCust, ...prev]);
    notify(`Customer ${newCust.name} added!`, 'success');
    return newCust;
  };

  const updateCustomer = (id, updatedData) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    notify('Customer record updated', 'success');
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    notify('Customer removed', 'info');
  };

  // POS Sales Billing Processing
  const createSale = ({ customer, items, paymentMethod, discountAmount = 0, notes = '' }) => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const taxRate = Number(storeSettings.taxRate) || 18;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = (discountedSubtotal * taxRate) / (100 + taxRate);
    const grandTotal = discountedSubtotal;

    const invoiceNo = `INV-${new Date().getFullYear()}-${String(sales.length + 1).padStart(3, '0')}`;
    const saleId = `sale-${Date.now()}`;

    // 1. Process Customer (Existing or New)
    let customerId = customer.id;
    if (!customerId && customer.phone) {
      const existing = customers.find((c) => c.phone === customer.phone);
      if (existing) {
        customerId = existing.id;
      } else if (customer.name) {
        const created = addCustomer({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || '',
          address: customer.address || ''
        });
        customerId = created.id;
      }
    }

    // 2. Update Customer Stats
    if (customerId) {
      const earnedPoints = Math.floor(grandTotal / 200);
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customerId
            ? {
                ...c,
                totalPurchases: (c.totalPurchases || 0) + grandTotal,
                ordersCount: (c.ordersCount || 0) + 1,
                points: (c.points || 0) + earnedPoints
              }
            : c
        )
      );
    }

    // 3. Mark Mobiles IMEIs as Sold & Decrement Stock
    items.forEach((item) => {
      if (item.type === 'mobile' && item.imeis && item.imeis.length > 0) {
        setMobiles((prev) =>
          prev.map((mob) => {
            if (mob.id !== item.itemId) return mob;
            const updatedImeis = (mob.imeis || []).map((im) => {
              if (item.imeis.includes(im.imei1) || item.imeis.includes(im.imei2) || item.imeis.includes(im.serial)) {
                return {
                  ...im,
                  status: 'sold',
                  soldDate: new Date().toISOString(),
                  invoiceId: invoiceNo
                };
              }
              return im;
            });
            return { ...mob, imeis: updatedImeis };
          })
        );
      } else if (item.type === 'accessory') {
        setAccessories((prev) =>
          prev.map((acc) =>
            acc.id === item.itemId
              ? {
                  ...acc,
                  stockCount: Math.max(0, (acc.stockCount || 0) - item.qty)
                }
              : acc
          )
        );
      }
    });

    // 4. Construct Final Sale Invoice Record
    const newSale = {
      id: saleId,
      invoiceNo,
      date: new Date().toISOString(),
      customerId: customerId || 'guest',
      customerName: customer.name || 'Walk-in Customer',
      customerPhone: customer.phone || 'N/A',
      customerEmail: customer.email || '',
      customerAddress: customer.address || '',
      items,
      subtotal,
      taxRate,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      discountAmount: Number(discountAmount) || 0,
      grandTotal,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: 'Completed',
      cashierName: currentUser?.name || 'Staff',
      notes
    };

    setSales((prev) => [newSale, ...prev]);
    triggerCelebration();
    notify(`Invoice ${invoiceNo} generated for ₹${grandTotal.toLocaleString('en-IN')}!`, 'success');
    return newSale;
  };

  // Purchase Order Management
  const createPurchase = ({ supplierName, supplierContact, supplierGst, billNumber, items, paymentMethod, paymentStatus = 'Paid', notes = '' }) => {
    const totalAmount = items.reduce((sum, it) => sum + (Number(it.unitCost) || 0) * (Number(it.qty) || 1), 0);
    const purchaseId = `po-${Date.now()}`;

    const newPurchase = {
      id: purchaseId,
      billNumber: billNumber || `PO-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, '0')}`,
      supplierName,
      supplierContact,
      supplierGst,
      date: new Date().toISOString().split('T')[0],
      items,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes
    };

    // Increment inventory with the purchased stock
    items.forEach((item) => {
      if (item.type === 'mobile') {
        const generatedUnits = (item.imeis || []).map((imeiVal) => ({
          imei1: imeiVal,
          imei2: '',
          serial: '',
          status: 'in_stock',
          dateAdded: new Date().toISOString().split('T')[0]
        }));

        setMobiles((prev) =>
          prev.map((mob) =>
            mob.id === item.itemId
              ? {
                  ...mob,
                  buyPrice: item.unitCost || mob.buyPrice,
                  imeis: [...(mob.imeis || []), ...generatedUnits]
                }
              : mob
          )
        );
      } else if (item.type === 'accessory') {
        setAccessories((prev) =>
          prev.map((acc) =>
            acc.id === item.itemId
              ? {
                  ...acc,
                  buyPrice: item.unitCost || acc.buyPrice,
                  stockCount: (acc.stockCount || 0) + (Number(item.qty) || 0)
                }
              : acc
          )
        );
      }
    });

    setPurchases((prev) => [newPurchase, ...prev]);
    notify(`Purchase Order ${newPurchase.billNumber} recorded and stock updated!`, 'success');
    return newPurchase;
  };

  // Brands & Categories
  const addBrand = (brand) => {
    const newBrand = { ...brand, id: `b-${Date.now()}`, active: true };
    setBrands((prev) => [...prev, newBrand]);
    notify(`Brand "${brand.name}" added`);
  };

  const deleteBrand = (id) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    notify('Brand removed', 'info');
  };

  const addCategory = (cat) => {
    const newCat = { ...cat, id: `c-${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
    notify(`Category "${cat.name}" added`);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    notify('Category removed', 'info');
  };

  // Global IMEI / Serial Lookup Tool
  const lookupImeiOrSerial = (query) => {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();

    // 1. Search in Mobiles IMEIs
    for (const mob of mobiles) {
      for (const imeiUnit of mob.imeis || []) {
        if (
          (imeiUnit.imei1 && imeiUnit.imei1.toLowerCase().includes(cleanQuery)) ||
          (imeiUnit.imei2 && imeiUnit.imei2.toLowerCase().includes(cleanQuery)) ||
          (imeiUnit.serial && imeiUnit.serial.toLowerCase().includes(cleanQuery))
        ) {
          // Find associated sale if sold
          const sale = sales.find((s) => s.invoiceNo === imeiUnit.invoiceId);
          return {
            type: 'Mobile Phone',
            product: mob,
            imeiUnit,
            saleRecord: sale || null,
            inStock: imeiUnit.status === 'in_stock'
          };
        }
      }
    }

    // 2. Search in Accessories Serials
    for (const acc of accessories) {
      for (const serial of acc.serials || []) {
        if (serial.toLowerCase().includes(cleanQuery)) {
          return {
            type: 'Accessory',
            product: acc,
            serial,
            inStock: true
          };
        }
      }
    }

    return null;
  };

  // Reset to Factory Sample Data
  const resetToDefaultData = () => {
    localStorage.clear();
    setStoreSettings(initialStoreSettings);
    setBrands(initialBrands);
    setCategories(initialCategories);
    setMobiles(initialMobiles);
    setAccessories(initialAccessories);
    setCustomers(initialCustomers);
    setSales(initialSales);
    setPurchases(initialPurchases);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    notify('System database restored to demo baseline!', 'info');
  };

  // Export JSON Backup
  const exportDatabaseJson = () => {
    const data = {
      storeSettings,
      brands,
      categories,
      mobiles,
      accessories,
      customers,
      sales,
      purchases,
      users,
      exportedAt: new Date().toISOString()
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mobipulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notify('Complete database JSON exported!');
  };

  // Import JSON Backup
  const importDatabaseJson = (jsonData) => {
    try {
      if (jsonData.storeSettings) setStoreSettings(jsonData.storeSettings);
      if (jsonData.brands) setBrands(jsonData.brands);
      if (jsonData.categories) setCategories(jsonData.categories);
      if (jsonData.mobiles) setMobiles(jsonData.mobiles);
      if (jsonData.accessories) setAccessories(jsonData.accessories);
      if (jsonData.customers) setCustomers(jsonData.customers);
      if (jsonData.sales) setSales(jsonData.sales);
      if (jsonData.purchases) setPurchases(jsonData.purchases);
      notify('Database backup restored successfully!', 'success');
      return true;
    } catch (e) {
      notify('Failed to import database JSON', 'error');
      return false;
    }
  };

  // Inventory count calculations
  const totalMobilesInStock = mobiles.reduce((sum, m) => {
    const inStockUnits = (m.imeis || []).filter((i) => i.status === 'in_stock').length;
    return sum + inStockUnits;
  }, 0);

  const totalAccessoriesInStock = accessories.reduce((sum, a) => sum + (a.stockCount || 0), 0);

  const totalInventoryValue =
    mobiles.reduce((sum, m) => {
      const inStockUnits = (m.imeis || []).filter((i) => i.status === 'in_stock').length;
      return sum + inStockUnits * m.buyPrice;
    }, 0) +
    accessories.reduce((sum, a) => sum + (a.stockCount || 0) * a.buyPrice, 0);

  const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);

  const lowStockMobiles = mobiles.filter((m) => {
    const inStock = (m.imeis || []).filter((i) => i.status === 'in_stock').length;
    return inStock <= (m.minStockAlert || 2);
  });

  const lowStockAccessories = accessories.filter((a) => (a.stockCount || 0) <= (a.minStockAlert || 4));

  return (
    <AppContext.Provider
      value={{
        // Auth & User
        currentUser,
        users,
        login,
        logout,
        switchRole,
        // Store
        storeSettings,
        setStoreSettings,
        // Data
        brands,
        addBrand,
        deleteBrand,
        categories,
        addCategory,
        deleteCategory,
        mobiles,
        addMobile,
        updateMobile,
        deleteMobile,
        addImeisToMobile,
        accessories,
        addAccessory,
        updateAccessory,
        deleteAccessory,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        sales,
        createSale,
        purchases,
        createPurchase,
        // Tools & Metrics
        lookupImeiOrSerial,
        resetToDefaultData,
        exportDatabaseJson,
        importDatabaseJson,
        totalMobilesInStock,
        totalAccessoriesInStock,
        totalInventoryValue,
        totalRevenue,
        lowStockMobiles,
        lowStockAccessories,
        // UI Navigation & Toasts
        activeTab,
        setActiveTab,
        toasts,
        notify,
        removeToast,
        triggerCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

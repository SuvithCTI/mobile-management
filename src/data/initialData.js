export const initialStoreSettings = {
  storeName: "MobiPulse Mobile Store",
  tagline: "Premium Smartphones & Authentic Accessories",
  phone: "+91 98765 43210",
  email: "contact@mobipulse.com",
  address: "Shop 104, Tech Plaza, MG Road, Bengaluru, Karnataka 560001",
  gstNumber: "29AABCS1429B1Z8",
  currency: "₹",
  taxRate: 18,
  invoiceFooterNote: "Thank you for shopping with MobiPulse! Warranty claims require original invoice.",
  termsAndConditions: "1. 7 days replacement for manufacturing defects.\n2. Physical and liquid damage is not covered under warranty.\n3. Keep original box and accessories intact for warranty verification."
};

export const initialBrands = [
  { id: "b1", name: "Apple", logo: "🍎", category: "Mobile & Accessories", active: true },
  { id: "b2", name: "Samsung", logo: "📱", category: "Mobile & Accessories", active: true },
  { id: "b3", name: "OnePlus", logo: "⚡", category: "Mobile & Accessories", active: true },
  { id: "b4", name: "Xiaomi", logo: "🟠", category: "Mobile & Accessories", active: true },
  { id: "b5", name: "Realme", logo: "🟡", category: "Mobile & Accessories", active: true },
  { id: "b6", name: "Google", logo: "🔍", category: "Mobile & Accessories", active: true },
  { id: "b7", name: "Nothing", logo: "⚪", category: "Mobile & Accessories", active: true },
  { id: "b8", name: "Spigen", logo: "🛡️", category: "Accessories", active: true },
  { id: "b9", name: "Anker", logo: "🔋", category: "Accessories", active: true },
  { id: "b10", name: "boAt", logo: "🎧", category: "Accessories", active: true },
  { id: "b11", name: "Sony", logo: "🎵", category: "Accessories", active: true }
];

export const initialCategories = [
  { id: "c1", name: "Flagship Smartphones", type: "mobile", icon: "Smartphone" },
  { id: "c2", name: "Budget Smartphones", type: "mobile", icon: "PhoneCall" },
  { id: "c3", name: "Foldables & Tablets", type: "mobile", icon: "Tablet" },
  { id: "c4", name: "Fast Chargers & Adapters", type: "accessory", icon: "Zap" },
  { id: "c5", name: "TWS Earbuds & Headphones", type: "accessory", icon: "Headphones" },
  { id: "c6", name: "Cases & Premium Covers", type: "accessory", icon: "Shield" },
  { id: "c7", name: "Tempered Glass & Protectors", type: "accessory", icon: "Layers" },
  { id: "c8", name: "Smartwatches & Bands", type: "accessory", icon: "Watch" },
  { id: "c9", name: "Power Banks & Cables", type: "accessory", icon: "BatteryCharging" }
];

export const initialMobiles = [
  {
    id: "mob-1",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    color: "Desert Titanium",
    ram: "8 GB",
    storage: "256 GB",
    category: "Flagship Smartphones",
    buyPrice: 124000,
    sellPrice: 144900,
    warrantyMonths: 12,
    minStockAlert: 2,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    description: "A18 Pro chip, Grade 5 Titanium design, 48MP Fusion Camera.",
    imeis: [
      { imei1: "359124089123451", imei2: "359124089123452", serial: "F2LX9981K", status: "in_stock", dateAdded: "2026-09-20" },
      { imei1: "359124089123453", imei2: "359124089123454", serial: "F2LX9982K", status: "in_stock", dateAdded: "2026-09-20" },
      { imei1: "359124089123455", imei2: "359124089123456", serial: "F2LX9983K", status: "sold", dateAdded: "2026-09-15", soldDate: "2026-09-28", invoiceId: "INV-2026-001" }
    ]
  },
  {
    id: "mob-2",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "Titanium Gray",
    ram: "12 GB",
    storage: "512 GB",
    category: "Flagship Smartphones",
    buyPrice: 112000,
    sellPrice: 129999,
    warrantyMonths: 12,
    minStockAlert: 2,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    description: "Snapdragon 8 Gen 3, Galaxy AI, 200MP Quad Camera, S-Pen included.",
    imeis: [
      { imei1: "354921098456101", imei2: "354921098456102", serial: "R5CW1011A", status: "in_stock", dateAdded: "2026-09-10" },
      { imei1: "354921098456103", imei2: "354921098456104", serial: "R5CW1012A", status: "in_stock", dateAdded: "2026-09-10" },
      { imei1: "354921098456105", imei2: "354921098456106", serial: "R5CW1013A", status: "in_stock", dateAdded: "2026-09-10" }
    ]
  },
  {
    id: "mob-3",
    brand: "OnePlus",
    model: "OnePlus 12 5G",
    color: "Emerald Green",
    ram: "16 GB",
    storage: "512 GB",
    category: "Flagship Smartphones",
    buyPrice: 56000,
    sellPrice: 64999,
    warrantyMonths: 12,
    minStockAlert: 3,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    description: "4th Gen Hasselblad Camera, 5400mAh Battery, 100W SUPERVOOC.",
    imeis: [
      { imei1: "867490051234901", imei2: "867490051234902", serial: "OP129841X", status: "in_stock", dateAdded: "2026-09-18" },
      { imei1: "867490051234903", imei2: "867490051234904", serial: "OP129842X", status: "in_stock", dateAdded: "2026-09-18" }
    ]
  },
  {
    id: "mob-4",
    brand: "Xiaomi",
    model: "Redmi Note 14 Pro+ 5G",
    color: "Arctic White",
    ram: "12 GB",
    storage: "256 GB",
    category: "Budget Smartphones",
    buyPrice: 24500,
    sellPrice: 29999,
    warrantyMonths: 12,
    minStockAlert: 4,
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80",
    description: "200MP OIS Camera, 120W HyperCharge, 1.5K 120Hz Curved AMOLED.",
    imeis: [
      { imei1: "865421049921101", imei2: "865421049921102", serial: "XM24N1401", status: "in_stock", dateAdded: "2026-09-22" },
      { imei1: "865421049921103", imei2: "865421049921104", serial: "XM24N1402", status: "in_stock", dateAdded: "2026-09-22" },
      { imei1: "865421049921105", imei2: "865421049921106", serial: "XM24N1403", status: "in_stock", dateAdded: "2026-09-22" },
      { imei1: "865421049921107", imei2: "865421049921108", serial: "XM24N1404", status: "in_stock", dateAdded: "2026-09-22" }
    ]
  },
  {
    id: "mob-5",
    brand: "Nothing",
    model: "Phone (2a) Plus",
    color: "Metallic Grey",
    ram: "12 GB",
    storage: "256 GB",
    category: "Budget Smartphones",
    buyPrice: 22000,
    sellPrice: 27999,
    warrantyMonths: 12,
    minStockAlert: 2,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&q=80",
    description: "Dimensity 7350 Pro, Glyph Interface, Dual 50MP Cameras.",
    imeis: [
      { imei1: "869103061200501", imei2: "869103061200502", serial: "NTH2AP01", status: "in_stock", dateAdded: "2026-09-25" }
    ]
  }
];

export const initialAccessories = [
  {
    id: "acc-1",
    name: "Apple 20W USB-C Power Adapter",
    category: "Fast Chargers & Adapters",
    brand: "Apple",
    buyPrice: 1300,
    sellPrice: 1900,
    stockCount: 18,
    minStockAlert: 5,
    warrantyMonths: 12,
    sku: "APL-20W-ADP",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    description: "Fast, efficient charging at home, in the office, or on the go.",
    serials: ["APL-20W-9901", "APL-20W-9902", "APL-20W-9903", "APL-20W-9904", "APL-20W-9905"]
  },
  {
    id: "acc-2",
    name: "Spigen Ultra Hybrid MagFit Case for iPhone 16 Pro Max",
    category: "Cases & Premium Covers",
    brand: "Spigen",
    buyPrice: 1100,
    sellPrice: 1999,
    stockCount: 12,
    minStockAlert: 4,
    warrantyMonths: 6,
    sku: "SPG-IP16P-HYB",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80",
    description: "Crystal clear anti-yellowing case with strong MagSafe ring.",
    serials: []
  },
  {
    id: "acc-3",
    name: "Anker 737 Power Bank (PowerCore 24K 140W)",
    category: "Power Banks & Cables",
    brand: "Anker",
    buyPrice: 8500,
    sellPrice: 12499,
    stockCount: 4,
    minStockAlert: 2,
    warrantyMonths: 24,
    sku: "ANK-737-24K",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
    description: "24,000mAh 3-Port portable charger with smart digital display.",
    serials: ["ANK-737-0101", "ANK-737-0102", "ANK-737-0103", "ANK-737-0104"]
  },
  {
    id: "acc-4",
    name: "Samsung Galaxy Buds3 Pro",
    category: "TWS Earbuds & Headphones",
    brand: "Samsung",
    buyPrice: 13500,
    sellPrice: 17999,
    stockCount: 7,
    minStockAlert: 3,
    warrantyMonths: 12,
    sku: "SAM-BUDS3-PRO",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Blade lights, 24-bit Hi-Fi audio, enhanced Adaptive ANC with Galaxy AI.",
    serials: ["SAM-B3P-7701", "SAM-B3P-7702", "SAM-B3P-7703"]
  },
  {
    id: "acc-5",
    name: "boAt Airdopes 141 ANC",
    category: "TWS Earbuds & Headphones",
    brand: "boAt",
    buyPrice: 950,
    sellPrice: 1699,
    stockCount: 22,
    minStockAlert: 8,
    warrantyMonths: 12,
    sku: "BOAT-AD-141",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
    description: "32dB ANC, 42 Hours playback, ENx Technology for crystal calls.",
    serials: []
  },
  {
    id: "acc-6",
    name: "Spigen EZ Fit Tempered Glass Screen Protector (2-Pack)",
    category: "Tempered Glass & Protectors",
    brand: "Spigen",
    buyPrice: 650,
    sellPrice: 1299,
    stockCount: 15,
    minStockAlert: 5,
    warrantyMonths: 3,
    sku: "SPG-EZFIT-9H",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80",
    description: "Auto-alignment installation kit with 9H diamond hardness.",
    serials: []
  }
];

export const initialCustomers = [
  {
    id: "cust-1",
    name: "Vikram Malhotra",
    phone: "+91 98450 11223",
    email: "vikram.m@gmail.com",
    address: "Flat 402, Green Glen Heights, Bellandur, Bengaluru",
    points: 350,
    totalPurchases: 146800,
    ordersCount: 2,
    createdAt: "2026-08-10"
  },
  {
    id: "cust-2",
    name: "Priya Sharma",
    phone: "+91 97312 44556",
    email: "priya.sharma99@yahoo.com",
    address: "B-12, Indiranagar 100ft Road, Bengaluru",
    points: 120,
    totalPurchases: 29999,
    ordersCount: 1,
    createdAt: "2026-09-02"
  },
  {
    id: "cust-3",
    name: "Arjun Reddy",
    phone: "+91 99001 88776",
    email: "arjun.reddy@techcorp.in",
    address: "Villa 14, Prestige Palms, Whitefield, Bengaluru",
    points: 580,
    totalPurchases: 147998,
    ordersCount: 3,
    createdAt: "2026-07-15"
  },
  {
    id: "cust-4",
    name: "Ananya Iyer",
    phone: "+91 96110 55443",
    email: "ananya.iyer@outlook.com",
    address: "3rd Cross, Koramangala 4th Block, Bengaluru",
    points: 40,
    totalPurchases: 3298,
    ordersCount: 1,
    createdAt: "2026-09-24"
  }
];

export const initialSales = [
  {
    id: "sale-1",
    invoiceNo: "INV-2026-001",
    date: "2026-09-28T14:30:00.000Z",
    customerId: "cust-1",
    customerName: "Vikram Malhotra",
    customerPhone: "+91 98450 11223",
    customerEmail: "vikram.m@gmail.com",
    customerAddress: "Flat 402, Green Glen Heights, Bellandur, Bengaluru",
    items: [
      {
        type: "mobile",
        itemId: "mob-1",
        name: "Apple iPhone 16 Pro Max (Desert Titanium 256 GB)",
        unitPrice: 144900,
        qty: 1,
        imeis: ["359124089123455"],
        warrantyMonths: 12,
        discount: 0,
        total: 144900
      },
      {
        type: "accessory",
        itemId: "acc-1",
        name: "Apple 20W USB-C Power Adapter",
        unitPrice: 1900,
        qty: 1,
        imeis: ["APL-20W-9905"],
        warrantyMonths: 12,
        discount: 0,
        total: 1900
      }
    ],
    subtotal: 146800,
    taxRate: 18,
    taxAmount: 22393.22,
    discountAmount: 0,
    grandTotal: 146800,
    paymentMethod: "Credit Card (HDFC Bank)",
    paymentStatus: "Completed",
    cashierName: "Aakash (Admin)",
    notes: "VIP Customer - Free Tempered glass applied."
  },
  {
    id: "sale-2",
    invoiceNo: "INV-2026-002",
    date: "2026-09-30T17:15:00.000Z",
    customerId: "cust-2",
    customerName: "Priya Sharma",
    customerPhone: "+91 97312 44556",
    customerEmail: "priya.sharma99@yahoo.com",
    customerAddress: "B-12, Indiranagar 100ft Road, Bengaluru",
    items: [
      {
        type: "mobile",
        itemId: "mob-4",
        name: "Xiaomi Redmi Note 14 Pro+ 5G (Arctic White 12/256 GB)",
        unitPrice: 29999,
        qty: 1,
        imeis: ["865421049921101"],
        warrantyMonths: 12,
        discount: 500,
        total: 29499
      }
    ],
    subtotal: 29999,
    taxRate: 18,
    taxAmount: 4499.85,
    discountAmount: 500,
    grandTotal: 29499,
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Completed",
    cashierName: "Rohan (Sales Staff)",
    notes: "Festival inaugural discount applied."
  }
];

export const initialPurchases = [
  {
    id: "po-101",
    billNumber: "PO-2026-901",
    supplierName: "Apex Mobile Wholesale Dist. Pvt Ltd",
    supplierContact: "+91 99880 77665",
    supplierGst: "29AABCA9988C1Z2",
    date: "2026-09-15",
    items: [
      {
        type: "mobile",
        itemId: "mob-1",
        name: "iPhone 16 Pro Max 256GB Desert Titanium",
        qty: 3,
        unitCost: 124000,
        totalCost: 372000,
        imeis: ["359124089123451", "359124089123453", "359124089123455"]
      }
    ],
    totalAmount: 372000,
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer (NEFT)",
    notes: "Batch delivered with seal intact."
  },
  {
    id: "po-102",
    billNumber: "PO-2026-902",
    supplierName: "TechGear Accessories Hub",
    supplierContact: "+91 98112 33445",
    supplierGst: "29XYZPK1234D1Z9",
    date: "2026-09-18",
    items: [
      {
        type: "accessory",
        itemId: "acc-3",
        name: "Anker 737 Power Bank 24K",
        qty: 5,
        unitCost: 8500,
        totalCost: 42500,
        imeis: ["ANK-737-0101", "ANK-737-0102", "ANK-737-0103", "ANK-737-0104", "ANK-737-0105"]
      },
      {
        type: "accessory",
        itemId: "acc-1",
        name: "Apple 20W USB-C Adapter",
        qty: 20,
        unitCost: 1300,
        totalCost: 26000,
        imeis: []
      }
    ],
    totalAmount: 68500,
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    notes: "Official distributor direct purchase."
  }
];

export const initialUsers = [
  {
    id: "u-1",
    name: "Alex Vance",
    username: "admin",
    password: "password123",
    role: "Admin",
    email: "admin@mobipulse.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    status: "Active"
  },
  {
    id: "u-2",
    name: "Rohan Patel",
    username: "sales",
    password: "password123",
    role: "Sales Staff",
    email: "rohan@mobipulse.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    status: "Active"
  }
];

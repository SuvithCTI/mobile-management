# 📱 MobiPulse PRO - Mobile & Mobile Accessories Sales Management System

A colorful, modern web-based Point of Sale (POS) and Inventory Management System engineered for smartphone retailers and accessories stores. Built with **React 18**, **Tailwind CSS**, **Lucide Icons**, **Recharts**, and an offline-first **LocalStorage Database Engine**.

---

## 🌟 Key Features & Modules

### 1. 🔐 User Roles & Authentication
- **Admin**: Full control over products, IMEI entries, inventory costs, supplier purchases, sales records, customer CRM, warranties, reports, brand taxonomy, and store settings.
- **Sales Staff**: Streamlined access to high-speed POS billing, real-time IMEI stock checking, customer lookup, and warranty verification.
- **Demo Quick-Switch**: One-click demo credential switcher (`admin / password123` or `sales / password123`).

### 2. 📊 Executive Dashboard
- Real-time KPIs: Total Revenue, Smartphones in Stock, Accessories in Stock, Registered Customers.
- Interactive Recharts Revenue Area graph and Phone Brand distribution pie chart.
- Low stock urgent alerts with 1-click supplier purchase triggers.
- Recent sales and invoice shortcut previews.

### 3. 📱 Mobile Phones & Dual IMEI Serialization
- Full specifications: Brand, Model, Color, RAM, Internal Storage, Cost Price, Retail Price, Warranty tenure.
- **Granular IMEI Tracking**: Manage Primary IMEI 1, Secondary IMEI 2, and Serial Number per unit.
- Real-time unit lifecycle status: `in_stock` vs `sold` (linked directly to the customer invoice).
- Filter by Brand, RAM, Storage, Category, and Stock Availability.

### 4. 🎧 Accessories Management
- Categorized for Fast Chargers, TWS Earbuds, Cases & Covers, Tempered Glass, Smartwatches, and Power Banks.
- Minimum safety stock thresholds with visual warning badges.
- SKU and Serial number registry.

### 5. 🛒 Fast POS Billing & Checkout
- Instant search by Name, Model, or scanned IMEI barcode.
- Interactive **IMEI Selector** when billing phones to ensure exact serial matching.
- Multi-mode payments: **UPI (Google Pay / PhonePe)**, **Credit/Debit Card**, **Cash**, **EMI Finance**.
- Automated GST breakdown, flat discounts, and customer loyalty point accruals.

### 6. 🧾 Dual-Format Tax Invoice & Receipts
- **Standard A4 Tax Invoice**: Complete GSTIN breakdown, IMEI serial tables, customer details, warranty terms, and authorized digital verification.
- **80mm Thermal POS Receipt**: Compact layout for thermal receipt printers.
- Direct **Print / Save as PDF** support.

### 7. 🛡️ Warranty & Service Ticket Center
- **IMEI Instant Lookup Tool (`Ctrl + K`)**: Verify active warranty validity, remaining days, purchase date, and original bill.
- RMA service tickets workflow (`Under Inspection`, `Repaired & Ready`, `Replaced`, `Rejected`).

### 8. 👥 Customer CRM & Loyalty Rewards
- Customer lifetime value, order histories, and automatic reward points accrual (1 point per ₹500 spent).
- Tier Badging: `Bronze`, `Gold Member`, `Platinum VIP`.
- Direct **WhatsApp** and phone call links.

### 9. 🚚 Supplier Purchase Orders (Stock In)
- Record supplier purchase bills, costs, and payment methods.
- Batch IMEI number paste tool to instantly populate inventory.

### 10. 📈 Reports & Financial Analytics
- Monthly Revenue vs. Gross Profit margin comparisons.
- Top-selling phones and accessories ranked by volume and revenue.
- Stock asset valuation.
- **1-Click Export to CSV** for accounting.

### 11. ⚙️ Settings, Customization & Data Backup
- Customize Store Name, GSTIN, Address, Support Phone, Currency Symbol, and Tax Rates.
- **JSON Database Backup & Restore**: Export complete store database snapshot or restore anytime.
- Reset to factory demo baseline.

---

## 🚀 How to Run the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

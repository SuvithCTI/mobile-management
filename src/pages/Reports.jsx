import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Reports = () => {
  const {
    sales,
    mobiles,
    accessories,
    storeSettings,
    totalInventoryValue,
    totalRevenue,
    totalMobilesInStock,
    totalAccessoriesInStock,
    setActiveTab,
    notify
  } = useApp();

  let estimatedTotalProfit = 0;
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      let costPrice = 0;
      if (item.type === 'mobile') {
        const mob = mobiles.find((m) => m.id === item.itemId);
        costPrice = mob ? mob.buyPrice : item.unitPrice * 0.85;
      } else {
        const acc = accessories.find((a) => a.id === item.itemId);
        costPrice = acc ? acc.buyPrice : item.unitPrice * 0.6;
      }
      const itemProfit = (item.unitPrice - costPrice) * item.qty;
      estimatedTotalProfit += itemProfit;
    });
  });

  const productPerformance = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productPerformance[item.name]) {
        productPerformance[item.name] = { name: item.name, units: 0, revenue: 0, type: item.type };
      }
      productPerformance[item.name].units += item.qty;
      productPerformance[item.name].revenue += item.total;
    });
  });

  const topSellingList = Object.values(productPerformance).sort((a, b) => b.revenue - a.revenue);

  const monthlyData = [
    { month: 'May', revenue: 210000, profit: 34000 },
    { month: 'Jun', revenue: 340000, profit: 56000 },
    { month: 'Jul', revenue: 290000, profit: 48000 },
    { month: 'Aug', revenue: 420000, profit: 71000 },
    { month: 'Sep', revenue: 510000, profit: 89000 },
    { month: 'Oct (Current)', revenue: totalRevenue, profit: estimatedTotalProfit }
  ];

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const curr = 'Rs. ';

      // 1. Header Banner (#701F47 with accent bottom line)
      doc.setFillColor(112, 31, 71); // Brand Burgundy
      doc.rect(0, 0, 210, 36, 'F');

      doc.setFillColor(56, 189, 248); // Sky Blue Accent Line
      doc.rect(0, 35, 210, 1.5, 'F');

      // Title & Brand
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MobiPulse Mobile Store', 14, 14);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Executive Financial Statement & Inventory Valuation Report', 14, 21);
      doc.setFontSize(7.5);
      doc.setTextColor(251, 207, 232);
      doc.text(`Generated: ${new Date().toLocaleString()} | Store: ${storeSettings.storeName || 'MobiPulse'}`, 14, 28);

      // Store Details (Right Aligned)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.text(`GSTIN: ${storeSettings.gstNumber || '29AABCS1429B1Z8'}`, 196, 14, { align: 'right' });
      doc.text(`Email: ${storeSettings.email || 'contact@mobipulse.com'}`, 196, 20, { align: 'right' });
      doc.text(`Phone: ${storeSettings.phone || '+91 98765 43210'}`, 196, 26, { align: 'right' });

      // 2. Executive Financial Summary Section
      let currentY = 46;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Executive Financial Summary', 14, currentY);

      currentY += 3.5;
      autoTable(doc, {
        startY: currentY,
        head: [['Total Sales Revenue', 'Estimated Gross Profit', 'Stock Inventory Asset Value']],
        body: [
          [
            `${curr}${totalRevenue.toLocaleString('en-IN')}\n(${sales.length} Customer Invoices)`,
            `${curr}${Math.round(estimatedTotalProfit).toLocaleString('en-IN')}\n(~${Math.round((estimatedTotalProfit / (totalRevenue || 1)) * 100)}% Gross Margin)`,
            `${curr}${totalInventoryValue.toLocaleString('en-IN')}\n(${totalMobilesInStock} Phones / ${totalAccessoriesInStock} Accessories)`
          ]
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontStyle: 'bold',
          fontSize: 8.5,
          halign: 'center',
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          textColor: [112, 31, 71],
          cellPadding: 4
        },
        margin: { left: 14, right: 14 }
      });

      // 3. Payment Method Distribution Summary
      currentY = doc.lastAutoTable.finalY + 8;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Revenue by Payment Method', 14, currentY);

      const paymentMap = {};
      sales.forEach((s) => {
        const method = s.paymentMethod || 'Cash';
        paymentMap[method] = (paymentMap[method] || 0) + s.grandTotal;
      });

      const paymentRows = Object.entries(paymentMap).map(([method, amount]) => [
        method,
        `${sales.filter((s) => (s.paymentMethod || 'Cash') === method).length} Transaction(s)`,
        `${Math.round((amount / (totalRevenue || 1)) * 100)}%`,
        `${curr}${amount.toLocaleString('en-IN')}`
      ]);

      currentY += 3.5;
      autoTable(doc, {
        startY: currentY,
        head: [['Payment Mode', 'Transactions Count', 'Share of Total', 'Net Collected']],
        body: paymentRows.length > 0 ? paymentRows : [['Cash', '0', '0%', `${curr}0`]],
        theme: 'striped',
        headStyles: {
          fillColor: [112, 31, 71],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 2.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
          cellPadding: 2.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          3: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
      });

      // 4. Top Performing Products
      currentY = doc.lastAutoTable.finalY + 8;
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Product Sales Performance & Rankings', 14, currentY);

      currentY += 3.5;
      const topProductsRows = topSellingList.slice(0, 10).map((p, idx) => [
        `#${idx + 1}`,
        p.name,
        p.type === 'mobile' ? 'Smartphone' : 'Accessory',
        `${p.units} Unit(s)`,
        `${curr}${p.revenue.toLocaleString('en-IN')}`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Rank', 'Product Model / Item Name', 'Category', 'Units Sold', 'Revenue Generated']],
        body: topProductsRows.length > 0 ? topProductsRows : [['-', 'No product sales recorded yet', '-', '-', '-']],
        theme: 'striped',
        headStyles: {
          fillColor: [112, 31, 71],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 2.5
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
          cellPadding: 2.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          4: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
      });

      // 5. Sales Invoices & Transaction History
      currentY = doc.lastAutoTable.finalY + 8;
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('4. Sales Invoices & Transaction Ledger', 14, currentY);

      currentY += 3.5;
      const salesRows = sales.map((s) => [
        s.invoiceNo,
        new Date(s.date).toLocaleDateString(),
        s.customerName || 'Walk-in Customer',
        s.items.map((i) => `${i.name} (x${i.qty})`).join(', ').slice(0, 36) + (s.items.map((i) => i.name).join(', ').length > 36 ? '...' : ''),
        s.paymentMethod || 'Cash',
        `${curr}${s.grandTotal.toLocaleString('en-IN')}`
      ]);

      // Add Grand Total Row
      if (sales.length > 0) {
        salesRows.push([
          'TOTAL',
          `${sales.length} Invoices`,
          '-',
          '-',
          '-',
          `${curr}${totalRevenue.toLocaleString('en-IN')}`
        ]);
      }

      autoTable(doc, {
        startY: currentY,
        head: [['Invoice #', 'Date', 'Customer', 'Items Summary', 'Payment', 'Invoice Total']],
        body: salesRows.length > 0 ? salesRows : [['-', '-', 'No invoices generated', '-', '-', '-']],
        theme: 'striped',
        headStyles: {
          fillColor: [14, 165, 233], // Sky Blue
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8,
          cellPadding: 2.5
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
          cellPadding: 2.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          5: { halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 14, right: 14 }
      });

      // Verification & Sign-off Block on last page
      currentY = doc.lastAutoTable.finalY + 12;
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      doc.setDrawColor(226, 232, 240);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(14, currentY, 196, currentY);
      doc.setLineDashPattern([], 0);

      currentY += 8;
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Verified & Approved By: __________________________', 14, currentY);
      doc.text('Store Manager Signature & Date: __________________________', 196, currentY, { align: 'right' });

      // Footer Page Numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${i} of ${pageCount} • MobiPulse Retail Management System • Official Confidential Statement`,
          105,
          288,
          { align: 'center' }
        );
      }

      doc.save(`mobipulse_financial_report_${new Date().toISOString().split('T')[0]}.pdf`);
      notify('PDF Financial Statement downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to export PDF report:', err);
      notify('Failed to generate PDF. Please check data and try again.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-black flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-500" />
            Financial Reports & Analytics
          </h2>
          <p className="text-xs font-semibold text-black">
            Revenue volume, profit margin calculations, and inventory valuations
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-[#701F47] hover:bg-[#5c193a] text-white font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 self-start md:self-auto"
          title="Download formatted PDF Financial Report"
        >
          <FileText className="w-4 h-4" />
          Export PDF Report
        </button>
      </div>

      {/* Summary KPI Cards with Interactive Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Total Sales Volume -> Navigates to Sales History */}
        <div
          onClick={() => setActiveTab('sales')}
          title="Click to view Sales History"
          className="card-sky p-4 rounded-2xl border border-sky-200 hover:border-sky-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <span className="text-xs font-bold text-black group-hover:text-sky-900 transition">Total Sales Volume</span>
          <h3 className="text-2xl font-extrabold text-black font-mono mt-1.5">
            {storeSettings.currency}{totalRevenue.toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">{sales.length} customer invoices</p>
        </div>

        {/* 2. Estimated Gross Profit -> Navigates to Sales History */}
        <div
          onClick={() => setActiveTab('sales')}
          title="Click to view Sales History"
          className="card-pink p-4 rounded-2xl border border-pink-200 hover:border-pink-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <span className="text-xs font-bold text-black group-hover:text-pink-900 transition">Estimated Gross Profit</span>
          <h3 className="text-2xl font-extrabold text-pink-700 font-mono mt-1.5">
            {storeSettings.currency}{Math.round(estimatedTotalProfit).toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">~{Math.round((estimatedTotalProfit / (totalRevenue || 1)) * 100)}% Gross Margin</p>
        </div>

        {/* 3. Stock Inventory Value -> Navigates to Mobiles Inventory */}
        <div
          onClick={() => setActiveTab('mobiles')}
          title="Click to view Mobiles Inventory"
          className="card-rose p-4 rounded-2xl border border-rose-200 hover:border-rose-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <span className="text-xs font-bold text-black group-hover:text-rose-900 transition">Stock Inventory Value</span>
          <h3 className="text-2xl font-extrabold text-black font-mono mt-1.5">
            {storeSettings.currency}{totalInventoryValue.toLocaleString()}
          </h3>
          <p className="text-xs text-black font-semibold mt-0.5">Asset cost of in-stock catalog</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-black">Monthly Revenue vs Net Margin</h3>
            <p className="text-xs font-semibold text-black">Sales vs gross profit</p>
          </div>
          <span className="px-2.5 py-0.5 bg-slate-100 text-black border border-slate-300 rounded-lg text-xs font-bold">
            FY 2026-27
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#000000" fontSize={11} fontWeight={600} />
              <YAxis stroke="#000000" fontSize={11} fontWeight={600} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '8px', color: '#000000', fontSize: '12px', fontWeight: 600 }}
                formatter={(val) => [`${storeSettings.currency}${Number(val).toLocaleString()}`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#000000', fontWeight: 600 }} />
              <Bar dataKey="revenue" name="Total Revenue" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Gross Profit" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products List */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
        <div>
          <h3 className="text-sm font-extrabold text-black">Top Performing Products</h3>
          <p className="text-xs font-semibold text-black">Ranked by revenue generation</p>
        </div>

        <div className="space-y-2">
          {topSellingList.map((prod, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50/80 hover:bg-sky-50/40 rounded-2xl border border-slate-200 hover:border-sky-300 transition flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-900 font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border border-sky-200 shadow-2xs">
                  #{idx + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs text-black truncate max-w-full">
                      {prod.name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border shrink-0 ${
                        prod.type === 'mobile'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-pink-50 text-pink-800 border-pink-200'
                      }`}
                    >
                      {prod.type === 'mobile' ? 'Phone' : 'Accessory'}
                    </span>
                  </div>

                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    {prod.units} {prod.units === 1 ? 'unit sold' : 'units sold'}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Revenue</span>
                <span className="font-mono font-extrabold text-xs sm:text-sm text-black">
                  {storeSettings.currency}{prod.revenue?.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

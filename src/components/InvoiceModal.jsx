import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, QrCode } from 'lucide-react';
import { LogoIcon } from './Logo';

export const InvoiceModal = ({ sale, isOpen, onClose }) => {
  const { storeSettings } = useApp();

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    const cleanCustomer = (sale.customerName || 'Customer').replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${sale.invoiceNo}_${cleanCustomer}_Tax_Invoice`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const cleanItemName = (name) => {
    if (!name) return '';
    // Clean duplicate consecutive brand words e.g. "Apple Apple 20W..." -> "Apple 20W..."
    return name.replace(/^([A-Za-z0-9]+)\s+\1\s+/i, '$1 ');
  };

  return (
    <div
      id="invoice-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs p-2 sm:p-6 flex justify-center items-start animate-fade-in no-print-bg"
    >
      <div
        id="invoice-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Controls Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 shrink-0 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></div>
            <span className="text-sm font-extrabold text-black">Official Tax Invoice</span>
            <span className="text-xs font-mono font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
              {sale.invoiceNo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-black hover:text-rose-600 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Viewport */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/90 block">
          <div
            id="printable-invoice"
            className="w-full max-w-2xl mx-auto bg-white text-black p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-md border border-slate-300 text-xs sm:text-sm font-sans space-y-4"
          >
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-300">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <LogoIcon className="w-10 h-10 shadow-xs" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-black leading-tight">
                      {storeSettings.storeName}
                    </h2>
                    <p className="text-[11px] font-bold text-slate-700">{storeSettings.tagline}</p>
                  </div>
                </div>

                <div className="mt-2.5 text-xs text-black font-medium space-y-0.5">
                  <p className="text-black font-semibold">{storeSettings.address}</p>
                  <p className="text-black">
                    Phone: <strong className="text-black">{storeSettings.phone}</strong> • Email: <strong className="text-black">{storeSettings.email}</strong>
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-[11px] font-extrabold text-black bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md">
                      GSTIN: {storeSettings.gstNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-900 font-extrabold text-xs rounded-lg uppercase tracking-wider mb-2 border border-sky-200">
                  TAX INVOICE
                </span>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-[10px] text-black font-bold uppercase block">Invoice Number</span>
                    <span className="text-base font-extrabold font-mono text-black">{sale.invoiceNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-black font-bold uppercase block">Date & Time</span>
                    <span className="text-xs font-semibold text-black">{new Date(sale.date).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-black font-bold uppercase block">Cashier</span>
                    <span className="text-xs font-bold text-black">{sale.cashierName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billed To & Payment Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-black block mb-1">
                  BILLED TO:
                </span>
                <h4 className="font-extrabold text-black text-sm">{sale.customerName || 'Walk-in Customer'}</h4>
                <p className="text-xs text-black font-semibold mt-0.5">Phone: {sale.customerPhone || 'N/A'}</p>
                {sale.customerEmail && <p className="text-xs text-black font-semibold">Email: {sale.customerEmail}</p>}
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-black block mb-1">
                  DELIVERY & PAYMENT:
                </span>
                <p className="text-xs text-black font-semibold">{sale.customerAddress || 'In-store counter delivery'}</p>
                <p className="text-xs text-black font-semibold mt-1">
                  Payment Method: <strong className="text-sky-900 font-extrabold bg-white px-2 py-0.5 rounded border border-slate-300 ml-1">{sale.paymentMethod || 'Cash'}</strong>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-[11px] font-extrabold uppercase tracking-wider text-black bg-slate-100/90">
                    <th className="py-2 px-3 rounded-l-lg">Item & Details</th>
                    <th className="py-2 px-2 text-center">Warranty</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {sale.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3">
                        <p className="font-extrabold text-black text-xs">{cleanItemName(item.name)}</p>
                        {item.imeis && item.imeis.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.imeis.map((imei, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.2 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono text-black font-bold"
                              >
                                IMEI: {imei}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center text-black font-bold">
                        {item.warrantyMonths ? `${item.warrantyMonths} Mo.` : 'N/A'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-extrabold text-black">{item.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-black font-semibold">
                        {storeSettings.currency}{item.unitPrice?.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-black">
                        {storeSettings.currency}{item.total?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Terms & Totals */}
            <div className="pt-3 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="text-[10px] text-black space-y-1">
                <p className="font-extrabold text-black uppercase tracking-wider text-[10px]">Terms & Conditions:</p>
                <p className="whitespace-pre-line text-black font-medium leading-relaxed text-[10px]">
                  {storeSettings.termsAndConditions}
                </p>
                {sale.notes && (
                  <div className="mt-2 p-2 bg-sky-50 border border-sky-200 rounded-lg text-black font-semibold text-[10px]">
                    <strong>Remarks:</strong> {sale.notes}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between text-black font-semibold">
                  <span>Subtotal:</span>
                  <span className="font-mono font-extrabold">{storeSettings.currency}{sale.subtotal?.toLocaleString()}</span>
                </div>
                {sale.discountAmount > 0 && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Discount:</span>
                    <span className="font-mono font-extrabold">-{storeSettings.currency}{sale.discountAmount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-black font-semibold text-[11px]">
                  <span>GST ({storeSettings.taxRate || 18}%):</span>
                  <span className="font-mono font-bold">{storeSettings.currency}{sale.taxAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-black pt-1.5 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span className="font-mono text-black font-extrabold">{storeSettings.currency}{sale.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="pt-1 text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-extrabold rounded-md shadow-2xs">
                    ✓ PAID ({sale.paymentMethod})
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-300 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 border border-slate-300 rounded-xl bg-slate-50 text-center shadow-2xs">
                  <QrCode className="w-9 h-9 text-black mx-auto" />
                  <span className="text-[8px] text-black font-mono font-bold block mt-0.5">VERIFY BILL</span>
                </div>
                <div className="text-[10px] text-black font-medium">
                  <p className="font-extrabold text-black">{storeSettings.invoiceFooterNote}</p>
                  <p className="mt-0.5 text-black font-semibold">Computer generated authentic invoice.</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-36 border-b-2 border-black mb-1.5"></div>
                <span className="text-[10px] text-black font-extrabold uppercase tracking-wider">Authorized Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

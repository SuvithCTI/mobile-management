import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { InvoiceModal } from './components/InvoiceModal';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Mobiles } from './pages/Mobiles';
import { Accessories } from './pages/Accessories';
import { POSSales } from './pages/POSSales';
import { Purchases } from './pages/Purchases';
import { SalesHistory } from './pages/SalesHistory';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export const MainApp = () => {
  const { currentUser, activeTab } = useApp();
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <Login />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSelectSale={(sale) => setSelectedInvoiceForModal(sale)} />;
      case 'pos':
        return <POSSales onOpenInvoice={(sale) => setSelectedInvoiceForModal(sale)} />;
      case 'mobiles':
        return <Mobiles />;
      case 'accessories':
        return <Accessories />;
      case 'purchases':
        return <Purchases />;
      case 'sales':
        return <SalesHistory onSelectSale={(sale) => setSelectedInvoiceForModal(sale)} />;
      case 'customers':
        return <Customers onSelectSale={(sale) => setSelectedInvoiceForModal(sale)} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSelectSale={(sale) => setSelectedInvoiceForModal(sale)} />;
    }
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-slate-50 text-slate-800 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        <Header onToggleMobileMenu={() => setIsMobileSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 overscroll-contain touch-pan-y">
          <div className="max-w-7xl mx-auto">{renderActivePage()}</div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />

      <InvoiceModal
        sale={selectedInvoiceForModal}
        isOpen={!!selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
      />
    </div>
  );
};

export default function App() {
  return <MainApp />;
}

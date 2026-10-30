import React from 'react';
import { CargoProvider, useCargo } from './context/CargoContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { ShipmentWizard } from './components/wizard/ShipmentWizard';
import { CargoTrackingView } from './components/tracking/CargoTrackingView';
import { AdminOperationsPanel } from './components/admin/AdminOperationsPanel';
import { ShippingLabelView } from './components/label/ShippingLabelView';
import { AccountingView } from './components/accounting/AccountingView';

const NavigoMainContent: React.FC = () => {
  const { activeTab } = useCargo();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Toast />
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'wizard' && <ShipmentWizard />}
        {activeTab === 'tracking' && <CargoTrackingView />}
        {activeTab === 'admin' && <AdminOperationsPanel />}
        {activeTab === 'label' && <ShippingLabelView />}
        {activeTab === 'accounting' && <AccountingView />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CargoProvider>
      <NavigoMainContent />
    </CargoProvider>
  );
}


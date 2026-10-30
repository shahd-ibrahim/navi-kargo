import React from 'react';
import {
  Boxes,
  Search,
  PlusCircle,
  Truck,
  Barcode,
  Building2,
} from 'lucide-react';
import { useCargo } from '../../context/CargoContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    shipments,
    searchTrackingCode,
    setSearchTrackingCode,
    handleTrackingSearch,
  } = useCargo();

  const pendingActionCount = shipments.filter(
    (s) => s.status === 'Fiyat Onayı Bekliyor' || s.status === 'Talep Alındı'
  ).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('wizard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white">NAVIGO</span>
                <span className="text-xl font-light text-cyan-400">KARGO</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Dijital Lojistik & Kargo Yönetimi
              </p>
            </div>
          </div>

          {/* Quick Tracking Search Bar */}
          <div className="hidden md:flex items-center w-72 lg:w-96 relative">
            <input
              type="text"
              placeholder="Takip No ile Sorgula (Örn: NVG-772104)"
              value={searchTrackingCode}
              onChange={(e) => setSearchTrackingCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrackingSearch()}
              className="w-full bg-slate-800/80 text-white text-xs placeholder-slate-400 pl-9 pr-20 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              onClick={() => handleTrackingSearch()}
              className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-md transition-colors"
            >
              Sorgula
            </button>
          </div>

          {/* Platform Mode Indicator */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
              Canlı Sistem v2.4
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Sub-nav */}
      <div className="bg-slate-950/60 border-t border-slate-800/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'wizard'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Müşteri Gönderi Talebi</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'tracking'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Kargo Takip Sorgulama</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Operasyon & Talep Havuzu</span>
              <span className="ml-1 bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                {pendingActionCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('label')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'label'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Barcode className="w-4 h-4" />
              <span>Kargo Sevk Etiketi (Zebra)</span>
            </button>

            <button
              onClick={() => setActiveTab('accounting')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'accounting'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Cari & Muhasebe Raporlama</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


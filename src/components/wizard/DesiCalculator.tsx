import React from 'react';
import { Package, AlertCircle, Send } from 'lucide-react';

interface DesiCalculatorProps {
  width: number | string;
  setWidth: (val: number | string) => void;
  length: number | string;
  setLength: (val: number | string) => void;
  height: number | string;
  setHeight: (val: number | string) => void;
  weight: number | string;
  setWeight: (val: number | string) => void;
  calculatedDesi: number;
  chargeableWeight: number;
  isSpecialPricing: boolean;
  estimatedPrice: number | null;
}

export const DesiCalculator: React.FC<DesiCalculatorProps> = ({
  width,
  setWidth,
  length,
  setLength,
  height,
  setHeight,
  weight,
  setWeight,
  calculatedDesi,
  chargeableWeight,
  isSpecialPricing,
  estimatedPrice,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 sticky top-28">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Akıllı Desi Hesaplayıcı</span>
          </h2>
          <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
            (E*B*Y)/3000
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">En (cm)</label>
            <input
              type="number"
              min="1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Boy (cm)</label>
            <input
              type="number"
              min="1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Yükseklik (cm)
            </label>
            <input
              type="number"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Ağırlık (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Desi vs Weight Comparison Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Hacimsel Desi:</span>
            <span className="font-bold text-slate-900">{calculatedDesi} desi</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Gerçek Ağırlık:</span>
            <span className="font-bold text-slate-900">{weight} kg</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-indigo-700">
            <span>Faturalandırılacak Hacim:</span>
            <span className="text-sm bg-indigo-100 px-2 py-0.5 rounded">
              {chargeableWeight} birim
            </span>
          </div>
        </div>

        {/* Price Preview Card */}
        {isSpecialPricing ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Özel Fiyatlandırma Statüsü</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              Gönderiniz 30 desi/kg üzerinde olduğundan operasyon merkezi kontrolü sonrası özel
              indirimli fiyat teklifi sunulacaktır.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Tahmini Taşıma Bedeli
            </span>
            <div className="text-3xl font-black text-emerald-700">
              {estimatedPrice} <span className="text-lg font-bold">₺</span>
              <span className="text-xs text-emerald-600 font-normal ml-1">+ KDV Dahil</span>
            </div>
            <p className="text-[10px] text-emerald-600">
              Standart Türkiye geneli hat tarifesi uygulanmıştır.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>Gönderi Talebini Tamamla</span>
        </button>
        <p className="text-center text-[10px] text-slate-400">
          Talep anında şirket paneline düşer ve kargo takip numarası üretilir.
        </p>
      </div>
    </div>
  );
};

export default DesiCalculator;


import React from 'react';
import { Boxes, AlertCircle, Truck, CheckCircle2 } from 'lucide-react';
import { Shipment } from '../../types/cargo';

interface KpiCardsProps {
  shipments: Shipment[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ shipments }) => {
  const totalCount = shipments.length;
  const waitingPrice = shipments.filter((s) => s.status === 'Fiyat Onayı Bekliyor').length;
  const inTransit = shipments.filter(
    (s) => s.status === 'Dağıtımda' || s.status === 'Depoda'
  ).length;
  const delivered = shipments.filter((s) => s.status === 'Teslim Edildi').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold block">Toplam Talep</span>
          <span className="text-2xl font-black text-slate-800">{totalCount}</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Boxes className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold block">Fiyat Bekleyen</span>
          <span className="text-2xl font-black text-amber-600">{waitingPrice}</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold block">Depoda / Dağıtımda</span>
          <span className="text-2xl font-black text-blue-600">{inTransit}</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-semibold block">Teslim Edilen</span>
          <span className="text-2xl font-black text-emerald-600">{delivered}</span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default KpiCards;


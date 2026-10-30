import React from 'react';
import { Building2 } from 'lucide-react';
import { CorporateAccount, Shipment } from '../../types/cargo';
import { useCargo } from '../../context/CargoContext';
import { CorporateLedgerTable } from './CorporateLedgerTable';

interface AccountingViewProps {
  accounts?: CorporateAccount[];
  shipments?: Shipment[];
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  accounts: propAccounts,
  shipments: propShipments,
}) => {
  const { corporateAccounts, shipments: ctxShipments } = useCargo();

  const accounts = propAccounts ?? corporateAccounts;
  const shipments = propShipments ?? ctxShipments;

  const totalBilled = '65.120 ₺';
  const totalCorporateShipments = shipments.length * 14;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Sözleşmeli Cari Hesaplar ve Faturalandırma</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Kurumsal müşterilerin aylık gönderi hacimleri, açık faturaları ve iskonto oranları.
          </p>
        </div>

        <div className="flex space-x-3">
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Aylık Cari Ciro
            </span>
            <span className="text-base font-black text-indigo-700">{totalBilled}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Toplam Kurumsal Çıkış
            </span>
            <span className="text-base font-black text-emerald-700">
              {totalCorporateShipments} Adet
            </span>
          </div>
        </div>
      </div>

      {/* Corporate Ledger Table */}
      <CorporateLedgerTable accounts={accounts} />
    </div>
  );
};

export default AccountingView;


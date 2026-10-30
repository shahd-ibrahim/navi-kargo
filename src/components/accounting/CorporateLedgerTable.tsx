import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { CorporateAccount } from '../../types/cargo';
import { useCargo } from '../../context/CargoContext';

interface CorporateLedgerTableProps {
  accounts: CorporateAccount[];
}

function escapeCsvField(value: string | number): string {
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export const CorporateLedgerTable: React.FC<CorporateLedgerTableProps> = ({ accounts }) => {
  const { showToast } = useCargo();

  const downloadAccountsCsv = (rowsToExport: CorporateAccount[], filenamePrefix: string) => {
    const headers = [
      'Cari Kod',
      'Firma Ünvanı',
      'Bu Ayki Gönderi (Koli)',
      'Özel Tarife / İskonto',
      'Açık Bakiye',
      'Hesap Durumu',
    ];

    const rows = rowsToExport.map((acc) => [
      escapeCsvField(acc.id),
      escapeCsvField(acc.name),
      escapeCsvField(acc.monthlyShipments),
      escapeCsvField(acc.discount),
      escapeCsvField(acc.balance),
      escapeCsvField(acc.status),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCsvField).join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportSingleAccount = (acc: CorporateAccount) => {
    downloadAccountsCsv([acc], `navigo_cari_ekstre_${acc.id.toLowerCase()}`);
    showToast(`${acc.name} (${acc.id}) cari ekstresi CSV olarak indirildi!`);
  };

  const handleExportAllAccounts = () => {
    downloadAccountsCsv(accounts, 'navigo_tum_kurumsal_cari_ekstre');
    showToast('Tüm sözleşmeli cari hesap bakiyeleri CSV olarak indirildi!');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            Sözleşmeli Kurumsal Cari Hesap Listesi
          </h3>
        </div>

        <button
          type="button"
          onClick={handleExportAllAccounts}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Tüm Cari Ekstreleri İndir (CSV)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Cari Kod</th>
              <th className="py-3.5 px-4">Firma Ünvanı</th>
              <th className="py-3.5 px-4">Bu Ayki Gönderi</th>
              <th className="py-3.5 px-4">Özel Tarife / İskonto</th>
              <th className="py-3.5 px-4">Açık Bakiye</th>
              <th className="py-3.5 px-4">Durum</th>
              <th className="py-3.5 px-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{acc.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{acc.name}</td>
                <td className="py-3.5 px-4">{acc.monthlyShipments} koli</td>
                <td className="py-3.5 px-4">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                    {acc.discount}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">{acc.balance}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      acc.status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {acc.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleExportSingleAccount(acc)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded text-[11px] font-semibold transition border border-slate-200"
                  >
                    <Download className="w-3 h-3" />
                    <span>Ekstre İndir (CSV)</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CorporateLedgerTable;

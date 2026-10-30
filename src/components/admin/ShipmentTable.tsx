import React from 'react';
import { Boxes, Barcode, Download } from 'lucide-react';
import { Shipment } from '../../types/cargo';

interface ShipmentTableProps {
  shipments: Shipment[];
  onOpenPriceModal: (shipment: Shipment) => void;
  onOpenCourierModal: (shipment: Shipment) => void;
  onPrintLabel: (shipment: Shipment) => void;
  onAdvanceStatus: (shipmentId: string) => void;
  onExportCsv: () => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onOpenPriceModal,
  onOpenCourierModal,
  onPrintLabel,
  onAdvanceStatus,
  onExportCsv,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Boxes className="w-4 h-4 text-indigo-600" />
            <span>Gelen Talep ve Gönderi Havuzu</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Toplam {shipments.length} kayıt gösteriliyor
          </span>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Excel / CSV Dışa Aktar</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Takip No & Tür</th>
              <th className="py-3.5 px-4">Gönderici</th>
              <th className="py-3.5 px-4">Alıcı / Şehir</th>
              <th className="py-3.5 px-4">Desi / Kg</th>
              <th className="py-3.5 px-4">Tutar / Ödeme</th>
              <th className="py-3.5 px-4">Kurye & Durum</th>
              <th className="py-3.5 px-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                {/* Takip No */}
                <td className="py-3 px-4">
                  <span className="font-black font-mono text-indigo-600 text-xs block">{s.id}</span>
                  <span className="text-[10px] text-slate-400">{s.serviceType}</span>
                </td>

                {/* Gönderici */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">{s.senderName}</div>
                  <div className="text-[11px] text-slate-400">{s.senderCity}</div>
                </td>

                {/* Alıcı */}
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">{s.receiverName}</div>
                  <div className="text-[11px] text-slate-400">{s.receiverCity}</div>
                </td>

                {/* Desi / Kg */}
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-700">{s.desi} desi</span>
                  <span className="text-[10px] text-slate-400 block">{s.weight} kg</span>
                </td>

                {/* Tutar */}
                <td className="py-3 px-4">
                  {s.price ? (
                    <span className="font-bold text-emerald-700 text-xs">{s.price} ₺</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Fiyat Bekliyor
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 block">{s.paymentType}</span>
                </td>

                {/* Durum & Kurye */}
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Teslim Edildi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'Fiyat Onayı Bekliyor'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {s.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[130px] mt-0.5">
                    {s.courier}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                  {s.status === 'Fiyat Onayı Bekliyor' && (
                    <button
                      onClick={() => onOpenPriceModal(s)}
                      className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-semibold transition"
                    >
                      Fiyat Belirle
                    </button>
                  )}

                  <button
                    onClick={() => onOpenCourierModal(s)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition"
                  >
                    Kurye Ata
                  </button>

                  <button
                    onClick={() => onPrintLabel(s)}
                    className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                    title="Termal Barkod Sevk Etiketi Bas"
                  >
                    <Barcode className="w-3.5 h-3.5" />
                    <span>Etiket</span>
                  </button>

                  {s.status !== 'Teslim Edildi' && (
                    <button
                      onClick={() => onAdvanceStatus(s.id)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition"
                      title="Sonraki Aşamaya Geçir"
                    >
                      İlerlet →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;

import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { Shipment } from '../../types/cargo';
import { useCargo } from '../../context/CargoContext';
import { KpiCards } from './KpiCards';
import { ShipmentTable } from './ShipmentTable';
import { CourierAssignModal } from './CourierAssignModal';
import { PriceApprovalModal } from './PriceApprovalModal';

interface AdminOperationsPanelProps {
  shipments?: Shipment[];
  setShipments?: React.Dispatch<React.SetStateAction<Shipment[]>>;
  onPrintLabel?: (shipment: Shipment) => void;
  showToast?: (msg: string) => void;
}

const STATUS_FILTERS = [
  'Tümü',
  'Fiyat Onayı Bekliyor',
  'Talep Alındı',
  'Depoda',
  'Dağıtımda',
  'Teslim Edildi',
];

function escapeCsvCell(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export const AdminOperationsPanel: React.FC<AdminOperationsPanelProps> = ({
  shipments: propShipments,
  setShipments: propSetShipments,
  onPrintLabel: propOnPrintLabel,
  showToast: propShowToast,
}) => {
  const {
    shipments: ctxShipments,
    setShipments: ctxSetShipments,
    openPrintLabel,
    showToast: ctxShowToast,
    filterStatus,
    setFilterStatus,
    adminSearchTerm: searchTerm,
    setAdminSearchTerm: setSearchTerm,
  } = useCargo();

  const shipments = propShipments ?? ctxShipments;
  const setShipments = propSetShipments ?? ctxSetShipments;
  const onPrintLabel = propOnPrintLabel ?? openPrintLabel;
  const showToast = propShowToast ?? ctxShowToast;

  // Modals
  const [assigningShipment, setAssigningShipment] = useState<Shipment | null>(null);
  const [selectedCourierName, setSelectedCourierName] = useState<string>(
    'Ahmet Şen (Avrupa Hat - Panelvan)'
  );

  const [pricingShipment, setPricingShipment] = useState<Shipment | null>(null);
  const [customPriceInput, setCustomPriceInput] = useState<string | number>('');

  // Filtered List
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchFilter = filterStatus === 'Tümü' ? true : s.status === filterStatus;
      const matchSearch =
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.senderCity.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [shipments, filterStatus, searchTerm]);

  // Handler: Export Filtered Shipments to CSV
  const handleExportCsv = () => {
    const headers = [
      'Takip No',
      'Gönderici',
      'Çıkış Şehri',
      'Gönderici Tel',
      'Alıcı',
      'Varış Şehri',
      'Alıcı Tel',
      'Desi',
      'Ağırlık (kg)',
      'Faturalandırılan Birim',
      'Durum',
      'Tutar (TL)',
      'Hizmet Tipi',
      'Ödeme Tipi',
      'Kurye',
      'Oluşturulma Tarihi',
    ];

    const rows = filteredShipments.map((s) => [
      escapeCsvCell(s.id),
      escapeCsvCell(s.senderName),
      escapeCsvCell(s.senderCity),
      escapeCsvCell(s.senderPhone),
      escapeCsvCell(s.receiverName),
      escapeCsvCell(s.receiverCity),
      escapeCsvCell(s.receiverPhone),
      escapeCsvCell(s.desi),
      escapeCsvCell(s.weight),
      escapeCsvCell(s.chargeableWeight),
      escapeCsvCell(s.status),
      escapeCsvCell(s.price ?? 'Fiyat Bekliyor'),
      escapeCsvCell(s.serviceType),
      escapeCsvCell(s.paymentType),
      escapeCsvCell(s.courier),
      escapeCsvCell(s.createdAt),
    ]);

    const csvContent = '\uFEFF' + [headers.map(escapeCsvCell).join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `navigo_kargo_operasyon_havuzu_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`${filteredShipments.length} gönderi kaydı Excel / CSV olarak dışa aktarıldı!`);
  };

  // Handler: Assign Courier
  const handleAssignCourier = () => {
    if (!assigningShipment) return;
    setShipments((prev) =>
      prev.map((item) =>
        item.id === assigningShipment.id
          ? {
              ...item,
              courier: selectedCourierName,
              status: item.status === 'Talep Alındı' ? 'Kurye Atandı' : item.status,
              timeline: [
                ...item.timeline,
                {
                  title: `Kurye Yönlendirildi: ${selectedCourierName}`,
                  time: 'Şimdi',
                  done: true,
                },
              ],
            }
          : item
      )
    );
    showToast(`${assigningShipment.id} için kurye atandı: ${selectedCourierName}`);
    setAssigningShipment(null);
  };

  // Handler: Approve Special Price
  const handleApprovePrice = () => {
    if (!pricingShipment || !customPriceInput) return;
    const priceNum = parseFloat(String(customPriceInput));
    setShipments((prev) =>
      prev.map((item) =>
        item.id === pricingShipment.id
          ? {
              ...item,
              price: priceNum,
              status: 'Talep Alındı',
              timeline: [
                ...item.timeline,
                { title: `Özel Fiyat Onaylandı: ${priceNum} ₺`, time: 'Şimdi', done: true },
              ],
            }
          : item
      )
    );
    showToast(
      `${pricingShipment.id} için ${priceNum} ₺ fiyat onaylandı ve müşteriye SMS/Mail bildirildi!`
    );
    setPricingShipment(null);
    setCustomPriceInput('');
  };

  // Handler: Quick Status Advance
  const handleAdvanceStatus = (shipmentId: string) => {
    const statusOrder = ['Talep Alındı', 'Kurye Atandı', 'Depoda', 'Dağıtımda', 'Teslim Edildi'];
    setShipments((prev) =>
      prev.map((item) => {
        if (item.id !== shipmentId) return item;
        const currentIdx = statusOrder.indexOf(item.status);
        if (currentIdx !== -1 && currentIdx < statusOrder.length - 1) {
          const nextStatus = statusOrder[currentIdx + 1];
          return {
            ...item,
            status: nextStatus,
            timeline: [
              ...item.timeline,
              { title: `Durum Güncellendi: ${nextStatus}`, time: 'Şimdi', done: true },
            ],
          };
        }
        return item;
      })
    );
    showToast(`${shipmentId} gönderi statüsü bir sonraki aşamaya taşındı.`);
  };

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS */}
      <KpiCards shipments={shipments} />

      {/* FILTER & ACTIONS BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Takip no, alıcı veya şehir ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filters & CSV Export */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 w-full lg:w-auto">
          <div className="flex items-center space-x-1 overflow-x-auto text-xs font-medium">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* TABLE: GELEN TALEP HAVUZU */}
      <ShipmentTable
        shipments={filteredShipments}
        onOpenPriceModal={(s) => {
          setPricingShipment(s);
          setCustomPriceInput(s.desi * 20);
        }}
        onOpenCourierModal={(s) => setAssigningShipment(s)}
        onPrintLabel={onPrintLabel}
        onAdvanceStatus={handleAdvanceStatus}
        onExportCsv={handleExportCsv}
      />

      {/* MODAL 1: KURYE ATAMA */}
      <CourierAssignModal
        assigningShipment={assigningShipment}
        selectedCourierName={selectedCourierName}
        setSelectedCourierName={setSelectedCourierName}
        onConfirm={handleAssignCourier}
        onClose={() => setAssigningShipment(null)}
      />

      {/* MODAL 2: ÖZEL FİYAT BELİRLEME */}
      <PriceApprovalModal
        pricingShipment={pricingShipment}
        customPriceInput={customPriceInput}
        setCustomPriceInput={setCustomPriceInput}
        onConfirm={handleApprovePrice}
        onClose={() => setPricingShipment(null)}
      />
    </div>
  );
};

export default AdminOperationsPanel;

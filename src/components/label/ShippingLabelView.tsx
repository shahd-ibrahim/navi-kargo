import React from 'react';
import { Barcode, Printer } from 'lucide-react';
import { Shipment } from '../../types/cargo';
import { useCargo } from '../../context/CargoContext';
import { ThermalBarcodePreview } from './ThermalBarcodePreview';

interface ShippingLabelViewProps {
  shipment?: Shipment;
  allShipments?: Shipment[];
  onSelectDifferent?: (item: Shipment) => void;
}

export const ShippingLabelView: React.FC<ShippingLabelViewProps> = ({
  shipment: propShipment,
  allShipments: propAllShipments,
  onSelectDifferent: propOnSelectDifferent,
}) => {
  const {
    selectedShipmentForLabel,
    setSelectedShipmentForLabel,
    shipments: ctxShipments,
  } = useCargo();

  const shipment = propShipment ?? selectedShipmentForLabel;
  const allShipments = propAllShipments ?? ctxShipments;
  const onSelectDifferent = propOnSelectDifferent ?? setSelectedShipmentForLabel;

  const handlePrint = () => {
    window.print();
  };

  if (!shipment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Lütfen etiket basmak için bir kargo seçiniz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controller */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center space-x-3">
          <Barcode className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              Termal Sevk Etiketi Önizleme (100x150 mm)
            </h3>
            <p className="text-[11px] text-slate-500">
              Zebra, Argox ve A4 lazer yazıcılara doğrudan uyumludur.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={shipment.id}
            onChange={(e) => {
              const found = allShipments.find((s) => s.id === e.target.value);
              if (found) onSelectDifferent(found);
            }}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
          >
            {allShipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.receiverName}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır (Print)</span>
          </button>
        </div>
      </div>

      {/* THERMAL LABEL PHYSICAL MOCKUP */}
      <ThermalBarcodePreview shipment={shipment} />
    </div>
  );
};

export default ShippingLabelView;


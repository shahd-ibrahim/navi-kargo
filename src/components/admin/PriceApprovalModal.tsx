import React from 'react';
import { X } from 'lucide-react';
import { Shipment } from '../../types/cargo';

interface PriceApprovalModalProps {
  pricingShipment: Shipment | null;
  customPriceInput: string | number;
  setCustomPriceInput: (val: string | number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const PriceApprovalModal: React.FC<PriceApprovalModalProps> = ({
  pricingShipment,
  customPriceInput,
  setCustomPriceInput,
  onConfirm,
  onClose,
}) => {
  if (!pricingShipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-sm text-slate-800">Özel Fiyatlandırma Onayı</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <div>
            <span className="font-bold">Paket:</span> {pricingShipment.id} (
            {pricingShipment.desi} desi / {pricingShipment.weight} kg)
          </div>
          <div>
            <span className="font-bold">Rota:</span> {pricingShipment.senderCity} →{' '}
            {pricingShipment.receiverCity}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Onaylanan Taşıma Bedeli (TL):
          </label>
          <input
            type="number"
            value={customPriceInput}
            onChange={(e) => setCustomPriceInput(e.target.value)}
            placeholder="Örn: 450"
            className="w-full text-sm font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-amber-700 transition"
          >
            Fiyatı Bildir & Onayla
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceApprovalModal;


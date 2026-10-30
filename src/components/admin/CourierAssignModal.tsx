import React from 'react';
import { X } from 'lucide-react';
import { Shipment } from '../../types/cargo';
import { COURIER_LIST } from '../../data/mockCargoData';

interface CourierAssignModalProps {
  assigningShipment: Shipment | null;
  selectedCourierName: string;
  setSelectedCourierName: (name: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const CourierAssignModal: React.FC<CourierAssignModalProps> = ({
  assigningShipment,
  selectedCourierName,
  setSelectedCourierName,
  onConfirm,
  onClose,
}) => {
  if (!assigningShipment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b pb-2">
          <h4 className="font-bold text-sm text-slate-800">Saha Kuryesi / Araç Ata</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-600">
          <span className="font-semibold">{assigningShipment.id}</span> nolu gönderi (
          {assigningShipment.senderCity}) için saha personeli seçiniz:
        </div>

        <select
          value={selectedCourierName}
          onChange={(e) => setSelectedCourierName(e.target.value)}
          className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
        >
          {COURIER_LIST.map((courier) => (
            <option key={courier} value={courier}>
              {courier}
            </option>
          ))}
        </select>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Atamayı Onayla
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierAssignModal;


import React, { useState } from 'react';
import { AlertCircle, Link2 } from 'lucide-react';
import { Shipment } from '../../types/cargo';
import { useCargo } from '../../context/CargoContext';
import { TrackingTimeline } from './TrackingTimeline';

interface CargoTrackingViewProps {
  trackedShipment?: Shipment | null;
  notFound?: boolean;
  onQuickCodeClick?: (code: string) => void;
  allShipments?: Shipment[];
}

export const CargoTrackingView: React.FC<CargoTrackingViewProps> = ({
  trackedShipment: propTrackedShipment,
  notFound: propNotFound,
  onQuickCodeClick,
  allShipments: propAllShipments,
}) => {
  const {
    trackedShipment: ctxTrackedShipment,
    trackingNotFound: ctxNotFound,
    handleTrackingSearch,
    shipments: ctxShipments,
    showToast,
  } = useCargo();

  const [inputCode, setInputCode] = useState<string>('');

  const trackedShipment =
    propTrackedShipment !== undefined ? propTrackedShipment : ctxTrackedShipment;
  const notFound = propNotFound !== undefined ? propNotFound : ctxNotFound;
  const allShipments = propAllShipments ?? ctxShipments;

  const triggerSearch = (code: string) => {
    if (onQuickCodeClick) {
      onQuickCodeClick(code);
    } else {
      handleTrackingSearch(code);
    }
  };

  const handleCopyTrackingUrl = (shipmentId: string) => {
    const trackingUrl = `${window.location.origin}${window.location.pathname}?tracking=${encodeURIComponent(
      shipmentId
    )}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(trackingUrl)
        .then(() => {
          showToast(`"${shipmentId}" takip bağlantısı panoya kopyalandı!`);
        })
        .catch(() => {
          showToast(`Takip bağlantısı hazır: ${trackingUrl}`);
        });
    } else {
      showToast(`Takip bağlantısı kopyalandı: ${trackingUrl}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Canlı Kargo Takip ve Sorgulama</h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Navigo Kargo takip numaranızı (Örn: NVG-772104) girerek paketinizin anlık konumunu ve
          durumunu görüntüleyin.
        </p>

        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="text"
            placeholder="Kargo Takip No..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch(inputCode)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => triggerSearch(inputCode)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition"
          >
            Sorgula
          </button>
        </div>

        {/* Quick Sample Clicks */}
        <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-500 flex-wrap gap-y-2">
          <span className="font-medium">Hızlı Deneme Kodları:</span>
          {allShipments.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => triggerSearch(s.id)}
              className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-2.5 py-1 rounded-md text-[11px] font-mono border border-slate-200 transition"
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {notFound ? (
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Gönderi Bulunamadı</h3>
          <p className="text-xs text-slate-500">
            Girdiğiniz takip koduna ait kayıt bulunamadı. Lütfen numarayı kontrol edip tekrar
            deneyiniz.
          </p>
        </div>
      ) : trackedShipment ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                Kargo Takip Kodu
              </span>
              <div className="flex items-center space-x-3 mt-0.5">
                <h2 className="text-2xl font-black tracking-wider">{trackedShipment.id}</h2>
                <button
                  type="button"
                  onClick={() => handleCopyTrackingUrl(trackedShipment.id)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-semibold transition"
                  title="Takip Bağlantısını Panoya Kopyala"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Takip Bağlantısını Kopyala</span>
                </button>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {trackedShipment.serviceType} • {trackedShipment.paymentType}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Mevcut Durum
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                  trackedShipment.status === 'Teslim Edildi'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : trackedShipment.status === 'Dağıtımda'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {trackedShipment.status}
              </span>
            </div>
          </div>

          {/* Route Overview */}
          <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide block mb-1">
                Çıkış Noktası
              </span>
              <div className="font-semibold text-slate-800 text-sm">
                {trackedShipment.senderName}
              </div>
              <div className="text-xs text-slate-500">{trackedShipment.senderCity}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block mb-1">
                Varış Noktası
              </span>
              <div className="font-semibold text-slate-800 text-sm">
                {trackedShipment.receiverName}
              </div>
              <div className="text-xs text-slate-500">{trackedShipment.receiverCity}</div>
            </div>
          </div>

          {/* Package Details Metrics */}
          <div className="px-6">
            <div className="grid grid-cols-3 gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">Hacim (Desi)</span>
                <span className="text-sm font-bold text-slate-800">
                  {trackedShipment.desi} desi
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Ağırlık</span>
                <span className="text-sm font-bold text-slate-800">
                  {trackedShipment.weight} kg
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Tutar</span>
                <span className="text-sm font-bold text-slate-800">
                  {trackedShipment.price ? `${trackedShipment.price} ₺` : 'Onay Bekliyor'}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <TrackingTimeline timeline={trackedShipment.timeline} />
        </div>
      ) : null}
    </div>
  );
};

export default CargoTrackingView;

import React, { useMemo } from 'react';
import { Shipment } from '../../types/cargo';

interface ThermalBarcodePreviewProps {
  shipment: Shipment;
}

/**
 * Standard Code 128 pattern table (values 0 - 106).
 * Each entry represents bar/space module widths (6 elements summing to 11 modules,
 * except Stop pattern 106 which has 7 elements summing to 13 modules).
 */
const CODE128_PATTERNS: string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312',
  '132212', '221213', '221312', '231212', '112232', '122132', '122231', '113222',
  '123122', '123221', '223211', '221132', '221231', '213212', '223112', '312131',
  '311222', '321122', '321221', '312212', '322112', '322211', '212123', '212321',
  '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121',
  '313121', '211331', '231131', '213113', '213311', '213131', '311123', '311321',
  '331121', '312113', '312311', '332111', '314111', '221411', '431111', '111224',
  '111422', '121124', '121421', '141122', '141221', '112214', '112412', '122114',
  '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112',
  '421211', '212141', '214121', '412121', '111143', '111341', '131141', '114113',
  '114311', '411113', '411311', '113141', '114131', '311141', '411131', '211412',
  '211214', '211232', '2331112',
];

interface BarcodeBar {
  x: number;
  width: number;
}

/**
 * Encodes an ASCII string into Code 128B bar coordinates for crisp SVG rendering.
 */
function encodeCode128B(text: string): { bars: BarcodeBar[]; totalModules: number } {
  const cleanText = text.replace(/[^\x20-\x7E]/g, '');
  const codes: number[] = [104]; // Start Code B
  let checksum = 104;

  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i) - 32;
    codes.push(code);
    checksum += code * (i + 1);
  }

  codes.push(checksum % 103); // Modulo 103 Checksum
  codes.push(106); // Stop Pattern

  const quietZone = 10;
  let currentModule = quietZone;
  const bars: BarcodeBar[] = [];

  for (const code of codes) {
    const pattern = CODE128_PATTERNS[code] || CODE128_PATTERNS[0];
    for (let i = 0; i < pattern.length; i++) {
      const width = parseInt(pattern[i], 10);
      if (i % 2 === 0) {
        bars.push({ x: currentModule, width });
      }
      currentModule += width;
    }
  }

  return {
    bars,
    totalModules: currentModule + quietZone,
  };
}

export const ThermalBarcodePreview: React.FC<ThermalBarcodePreviewProps> = ({ shipment }) => {
  const barcodeData = useMemo(() => encodeCode128B(shipment.id), [shipment.id]);

  return (
    <div id="shipping-label-wrapper" className="flex justify-center">
      <div
        id="shipping-label-container"
        className="w-[380px] bg-white border-2 border-slate-950 p-5 rounded shadow-lg text-slate-950 flex flex-col justify-between space-y-3 font-sans print:border print:border-black print:shadow-none"
        style={{
          minHeight: '540px',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {/* Label Header */}
        <div className="flex justify-between items-center border-b-2 border-slate-950 pb-2">
          <div>
            <div className="text-xl font-black tracking-tight flex items-center gap-1">
              <span>NAVIGO</span>
              <span className="font-light">KARGO</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest block font-bold text-slate-700">
              Lojistik Sevk Belgesi (100x150mm)
            </span>
          </div>
          <div className="text-right">
            <span className="label-badge-invert text-lg font-black bg-slate-950 text-white px-2 py-0.5 rounded">
              {shipment.senderCity.includes('İstanbul') ? '34-IST' : '27-GZT'}
            </span>
            <span className="text-[9px] block text-slate-600 font-mono mt-0.5">HUB: MAR-01</span>
          </div>
        </div>

        {/* Code 128 SVG Barcode Section */}
        <div className="text-center py-2 border-b-2 border-slate-950">
          <div className="w-full flex items-center justify-center px-1">
            <svg
              viewBox={`0 0 ${barcodeData.totalModules} 56`}
              className="w-full h-16 max-w-[330px]"
              shapeRendering="crispEdges"
              role="img"
              aria-label={`Code 128 Barkod: ${shipment.id}`}
            >
              <rect x="0" y="0" width={barcodeData.totalModules} height="56" fill="#ffffff" />
              {barcodeData.bars.map((bar, index) => (
                <rect
                  key={index}
                  x={bar.x}
                  y="2"
                  width={bar.width}
                  height="52"
                  fill="#000000"
                />
              ))}
            </svg>
          </div>
          <div className="font-mono text-sm font-black tracking-widest mt-1 text-black">
            *{shipment.id}*
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-slate-500 block">
            CODE-128B OPTİK TARAYICI UYUMLU
          </span>
        </div>

        {/* Sender & Receiver Boxes */}
        <div className="border-b-2 border-slate-950 pb-2 text-[11px] space-y-1">
          <span className="text-[9px] uppercase font-black text-slate-500 block">
            ALICI (DELIVERY TO):
          </span>
          <div className="font-black text-sm uppercase text-black">{shipment.receiverName}</div>
          <div className="font-semibold text-slate-800 leading-snug">{shipment.receiverCity}</div>
          <div className="text-slate-600 font-mono">Tel: {shipment.receiverPhone}</div>
        </div>

        <div className="border-b-2 border-slate-950 pb-2 text-[10px] space-y-0.5">
          <span className="text-[9px] uppercase font-black text-slate-500 block">
            GÖNDERİCİ (FROM):
          </span>
          <div className="font-bold text-black">{shipment.senderName}</div>
          <div className="text-slate-600 truncate">{shipment.senderCity}</div>
          <div className="text-slate-500 font-mono">Tel: {shipment.senderPhone}</div>
        </div>

        {/* Metrics Table */}
        <div className="grid grid-cols-4 border-b-2 border-slate-950 pb-2 text-center text-[10px]">
          <div className="border-r border-slate-400">
            <span className="text-[8px] text-slate-500 block">DESİ</span>
            <span className="font-black text-xs text-black">{shipment.desi}</span>
          </div>
          <div className="border-r border-slate-400">
            <span className="text-[8px] text-slate-500 block">KG</span>
            <span className="font-black text-xs text-black">{shipment.weight}</span>
          </div>
          <div className="border-r border-slate-400">
            <span className="text-[8px] text-slate-500 block">PARÇA</span>
            <span className="font-black text-xs text-black">1 / 1</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-500 block">TUTAR</span>
            <span className="font-black text-xs text-black">
              {shipment.price ? `${shipment.price} TL` : 'CARİ'}
            </span>
          </div>
        </div>

        {/* Footer QR & Payment Status */}
        <div className="flex justify-between items-center pt-1 text-[10px]">
          <div>
            <span className="font-black block uppercase text-[11px] text-black">
              {shipment.paymentType}
            </span>
            <span className="text-slate-600 font-mono text-[9px] block">{shipment.serviceType}</span>
            <span className="text-slate-500 font-mono text-[9px]">{shipment.createdAt}</span>
          </div>

          {/* Crisp SVG QR Matrix Mockup */}
          <svg
            viewBox="0 0 7 7"
            className="w-12 h-12 border-2 border-slate-950 p-0.5"
            shapeRendering="crispEdges"
            aria-label="Sevk QR Kodu"
          >
            <rect width="7" height="7" fill="#ffffff" />
            <rect x="0" y="0" width="3" height="3" fill="#000000" />
            <rect x="1" y="1" width="1" height="1" fill="#ffffff" />
            <rect x="4" y="0" width="3" height="3" fill="#000000" />
            <rect x="5" y="1" width="1" height="1" fill="#ffffff" />
            <rect x="0" y="4" width="3" height="3" fill="#000000" />
            <rect x="1" y="5" width="1" height="1" fill="#ffffff" />
            <rect x="3" y="3" width="1" height="1" fill="#000000" />
            <rect x="4" y="4" width="2" height="1" fill="#000000" />
            <rect x="4" y="6" width="3" height="1" fill="#000000" />
            <rect x="6" y="4" width="1" height="2" fill="#000000" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThermalBarcodePreview;

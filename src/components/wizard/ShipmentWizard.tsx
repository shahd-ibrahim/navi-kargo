import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Truck,
  MapPin,
  User,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { UserType, Shipment } from '../../types/cargo';
import { SENDER_CITIES, RECEIVER_CITIES } from '../../data/mockCargoData';
import { useCargo } from '../../context/CargoContext';
import { UserTypeSelector } from './UserTypeSelector';
import { DesiCalculator } from './DesiCalculator';

interface ShipmentWizardProps {
  onShipmentCreated?: (newShipment: Shipment) => void;
  onGoToTracking?: (code: string) => void;
}

interface FormErrors {
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
}

/**
 * Formats a raw string into Turkish mobile mask: 05XX XXX XX XX
 */
function formatPhoneMask(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length > 0 && !digits.startsWith('0')) {
    if (digits.startsWith('5')) {
      digits = '0' + digits;
    }
  }
  digits = digits.slice(0, 11);

  const part1 = digits.slice(0, 4);
  const part2 = digits.slice(4, 7);
  const part3 = digits.slice(7, 9);
  const part4 = digits.slice(9, 11);

  return [part1, part2, part3, part4].filter(Boolean).join(' ');
}

export const ShipmentWizard: React.FC<ShipmentWizardProps> = ({
  onShipmentCreated,
  onGoToTracking,
}) => {
  const { addShipment, handleTrackingSearch, showToast } = useCargo();

  const [userType, setUserType] = useState<UserType>('bireysel');

  // Form State
  const [senderName, setSenderName] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [senderCity, setSenderCity] = useState<string>('İstanbul');
  const [senderAddress, setSenderAddress] = useState<string>('');

  const [receiverName, setReceiverName] = useState<string>('');
  const [receiverPhone, setReceiverPhone] = useState<string>('');
  const [receiverCity, setReceiverCity] = useState<string>('Ankara');
  const [receiverAddress, setReceiverAddress] = useState<string>('');

  // Validation Errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Package Dimensions
  const [width, setWidth] = useState<number | string>(30); // En cm
  const [length, setLength] = useState<number | string>(40); // Boy cm
  const [height, setHeight] = useState<number | string>(25); // Yükseklik cm
  const [weight, setWeight] = useState<number | string>(3.5); // Ağırlık kg
  const [paymentMethod, setPaymentMethod] = useState<string>('Gönderici Öder (Nakit / Kredi Kartı)');
  const [serviceType, setServiceType] = useState<string>('Standart Kargo (24-48 Saat)');

  // Last created shipment modal state
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);

  // Live Desi calculation: (En * Boy * Yükseklik) / 3000
  const calculatedDesi = useMemo(() => {
    const w = parseFloat(String(width)) || 0;
    const l = parseFloat(String(length)) || 0;
    const h = parseFloat(String(height)) || 0;
    const res = (w * l * h) / 3000;
    return Number(res.toFixed(2));
  }, [width, length, height]);

  const chargeableWeight = useMemo(() => {
    const w = parseFloat(String(weight)) || 0;
    return Math.max(w, calculatedDesi);
  }, [weight, calculatedDesi]);

  // Is special pricing required? (e.g., if Desi >= 30 or Weight >= 30kg)
  const isSpecialPricing = chargeableWeight >= 30;

  // Price estimate (Mock formula: Base 45 TL + 18 TL/desi)
  const estimatedPrice = useMemo(() => {
    if (isSpecialPricing) return null;
    const base = 45;
    const rate = 18;
    const cost = base + chargeableWeight * rate;
    return Math.round(cost);
  }, [chargeableWeight, isSpecialPricing]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!senderName.trim()) {
      nextErrors.senderName =
        userType === 'kurumsal' ? 'Firma ünvanı zorunludur' : 'Gönderici adı zorunludur';
    }

    const senderDigits = senderPhone.replace(/\D/g, '');
    if (!senderDigits) {
      nextErrors.senderPhone = 'Telefon numarası zorunludur';
    } else if (senderDigits.length < 10) {
      nextErrors.senderPhone = 'Geçerli bir telefon giriniz (05XX XXX XX XX)';
    }

    if (!receiverName.trim()) {
      nextErrors.receiverName = 'Alıcı ad soyad / şirket zorunludur';
    }

    const receiverDigits = receiverPhone.replace(/\D/g, '');
    if (!receiverDigits) {
      nextErrors.receiverPhone = 'Alıcı telefonu zorunludur';
    } else if (receiverDigits.length < 10) {
      nextErrors.receiverPhone = 'Geçerli bir telefon giriniz (05XX XXX XX XX)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Lütfen zorunlu alanları kontrol ediniz.');
      return;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingId = `NVG-${randomSuffix}`;

    const newShipment: Shipment = {
      id: trackingId,
      senderName: userType === 'kurumsal' ? `${senderName.trim()} (Kurumsal)` : senderName.trim(),
      senderCity: `${senderCity} - ${senderAddress.trim() || 'Merkez'}`,
      senderPhone: senderPhone || '0555 000 00 00',
      receiverName: receiverName.trim(),
      receiverCity: `${receiverCity} - ${receiverAddress.trim() || 'Merkez'}`,
      receiverPhone: receiverPhone || '0544 000 00 00',
      desi: calculatedDesi,
      weight: parseFloat(String(weight)) || 1,
      chargeableWeight: chargeableWeight,
      status: isSpecialPricing ? 'Fiyat Onayı Bekliyor' : 'Talep Alındı',
      price: isSpecialPricing ? null : estimatedPrice,
      serviceType: serviceType,
      paymentType: paymentMethod,
      createdAt: 'Bugün, Az Önce',
      courier: 'Atama Bekleniyor (Saha)',
      timeline: [
        { title: 'Talep Alındı', time: 'Az Önce', done: true },
        { title: 'Operasyon & Kurye Onayı', time: 'Hazırlanıyor', done: false },
        { title: 'Saha Toplama (Pick-up)', time: 'Beklemede', done: false },
        { title: 'Transfer Merkezinde', time: 'Beklemede', done: false },
        { title: 'Teslimat', time: 'Beklemede', done: false },
      ],
    };

    if (onShipmentCreated) {
      onShipmentCreated(newShipment);
    } else {
      addShipment(newShipment);
    }
    setCreatedShipment(newShipment);
  };

  const handleShareWhatsApp = (shipment: Shipment) => {
    const rawReceiverDigits = shipment.receiverPhone.replace(/\D/g, '');
    const intlPhone = rawReceiverDigits.startsWith('0')
      ? `90${rawReceiverDigits.slice(1)}`
      : rawReceiverDigits;

    const trackingUrl = `${window.location.origin}${window.location.pathname}?tracking=${encodeURIComponent(
      shipment.id
    )}`;

    const priceLine = shipment.price
      ? `Taşıma Bedeli: ${shipment.price} ₺ (${shipment.paymentType})`
      : 'Taşıma Bedeli: Özel Hacimli Fiyat Onayı Bekliyor';

    const message = [
      `📦 *NAVIGO KARGO BİLGİLENDİRME*`,
      `Sayın *${shipment.receiverName}*,`,
      `*${shipment.senderName}* tarafından adınıza kargo gönderisi oluşturulmuştur.`,
      ``,
      `🔖 *Takip Kodu:* ${shipment.id}`,
      `📍 *Çıkış:* ${shipment.senderCity}`,
      `🏁 *Varış:* ${shipment.receiverCity}`,
      `⚖️ *Hacim / Ağırlık:* ${shipment.desi} desi / ${shipment.weight} kg`,
      `💳 ${priceLine}`,
      ``,
      `🔍 Canlı Takip Bağlantısı: ${trackingUrl}`,
    ].join('\n');

    const waUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    showToast('WhatsApp bilgilendirme bağlantısı oluşturuldu!');
  };

  return (
    <div className="space-y-6">
      {/* SUCCESS MODAL POPUP */}
      {createdShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Gönderi Talebi Alındı!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Kargonuz Navigo operasyon merkezine iletildi. Saha kuryesi toplama için
                yönlendirilecektir.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                Takip Kodunuz
              </span>
              <div className="text-2xl font-black text-indigo-600 tracking-wider select-all">
                {createdShipment.id}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isSpecialPricing
                  ? '⚠️ Hacimli paket nedeniyle desi onayı sonrası SMS/Mail ile kesin tutar iletilecektir.'
                  : `Tahmini Tutar: ${estimatedPrice} ₺ (${paymentMethod})`}
              </p>
            </div>

            {/* WhatsApp Notification Generator Button */}
            <button
              type="button"
              onClick={() => handleShareWhatsApp(createdShipment)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center space-x-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Bilgilendirme Linki Gönder</span>
            </button>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onGoToTracking) {
                    onGoToTracking(createdShipment.id);
                  } else {
                    handleTrackingSearch(createdShipment.id);
                  }
                  setCreatedShipment(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-xs transition"
              >
                Kargoyu Takip Et
              </button>
              <button
                type="button"
                onClick={() => setCreatedShipment(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg text-xs transition"
              >
                Yeni Gönderi Gir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider border border-indigo-400/20">
            Adımdan Adıma Gönderi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Akıllı Kargo Gönderimi ve Canlı Desi Hesabı
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Paketinizin ebatlarını girin, sistem desi ve ağırlık kıyaslamasını anında yapsın. Tek
            tıkla kurye çağırın veya şubeye teslim edin.
          </p>

          {/* User Type Switcher */}
          <UserTypeSelector userType={userType} onSelectUserType={setUserType} />
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Truck className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* FORM & LIVE CALCULATOR SPLIT */}
      <form noValidate onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: ADRES VE GÖNDERİ BİLGİLERİ */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adres Bilgileri Kartı */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>1. Çıkış & Teslimat Adres Bilgileri</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ÇIKIŞ (GÖNDERİCİ) */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Çıkış (Gönderici)
                </span>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-600">
                      {userType === 'kurumsal' ? 'Firma Ünvanı *' : 'Ad Soyad *'}
                    </label>
                    {errors.senderName && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        <AlertCircle className="w-3 h-3" />
                        {errors.senderName}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder={
                      userType === 'kurumsal' ? 'Örn: ABC Lojistik Ltd.' : 'Örn: Barış Aydın'
                    }
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      if (errors.senderName) {
                        setErrors((prev) => ({ ...prev, senderName: undefined }));
                      }
                    }}
                    className={`w-full text-xs bg-white border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                      errors.senderName
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-indigo-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={senderPhone}
                      onChange={(e) => {
                        const formatted = formatPhoneMask(e.target.value);
                        setSenderPhone(formatted);
                        if (errors.senderPhone) {
                          setErrors((prev) => ({ ...prev, senderPhone: undefined }));
                        }
                      }}
                      className={`w-full text-xs bg-white border rounded-lg p-2.5 font-mono focus:ring-2 focus:outline-none ${
                        errors.senderPhone
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.senderPhone && (
                      <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.senderPhone}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Çıkış İli *
                    </label>
                    <select
                      value={senderCity}
                      onChange={(e) => setSenderCity(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {SENDER_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Açık Adres (Mahalle, Sokak, Kapı No)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Kuryenin paketi alacağı net adres..."
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* VARIŞ (ALICI) */}
              <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Teslimat (Alıcı)
                </span>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-600">
                      Alıcı Ad Soyad / Şirket *
                    </label>
                    {errors.receiverName && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        <AlertCircle className="w-3 h-3" />
                        {errors.receiverName}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Örn: Mehmet Özkan"
                    value={receiverName}
                    onChange={(e) => {
                      setReceiverName(e.target.value);
                      if (errors.receiverName) {
                        setErrors((prev) => ({ ...prev, receiverName: undefined }));
                      }
                    }}
                    className={`w-full text-xs bg-white border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${
                      errors.receiverName
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-indigo-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Alıcı Telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="05XX XXX XX XX"
                      value={receiverPhone}
                      onChange={(e) => {
                        const formatted = formatPhoneMask(e.target.value);
                        setReceiverPhone(formatted);
                        if (errors.receiverPhone) {
                          setErrors((prev) => ({ ...prev, receiverPhone: undefined }));
                        }
                      }}
                      className={`w-full text-xs bg-white border rounded-lg p-2.5 font-mono focus:ring-2 focus:outline-none ${
                        errors.receiverPhone
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.receiverPhone && (
                      <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.receiverPhone}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Teslim İli *
                    </label>
                    <select
                      value={receiverCity}
                      onChange={(e) => setReceiverCity(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {RECEIVER_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Teslimat Adresi
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Alıcının tam teslim adresi..."
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hizmet & Ödeme Seçenekleri */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>2. Hizmet ve Ödeme Tipi</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Taşıma Servisi
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                >
                  <option>Standart Kargo (24-48 Saat)</option>
                  <option>Hızlı Express (24 Saat Öncelikli)</option>
                  <option>Aynı Gün Teslimat (Şehir İçi)</option>
                  <option>Özel Hacimli Sevk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ödeme Yöntemi
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                >
                  <option>Gönderici Öder (Nakit / Kredi Kartı)</option>
                  <option>Alıcı Öder (Kapıda Tahsilat)</option>
                  {userType === 'kurumsal' && <option>Cari Hesap (Aylık Faturalı)</option>}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: SMART DESI & PRICING PREVIEW */}
        <DesiCalculator
          width={width}
          setWidth={setWidth}
          length={length}
          setLength={setLength}
          height={height}
          setHeight={setHeight}
          weight={weight}
          setWeight={setWeight}
          calculatedDesi={calculatedDesi}
          chargeableWeight={chargeableWeight}
          isSpecialPricing={isSpecialPricing}
          estimatedPrice={estimatedPrice}
        />
      </form>
    </div>
  );
};

export default ShipmentWizard;

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shipment, CorporateAccount, ActiveTab } from '../types/cargo';
import { INITIAL_SHIPMENTS, CORPORATE_ACCOUNTS } from '../data/mockCargoData';

interface CargoContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shipments: Shipment[];
  setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
  corporateAccounts: CorporateAccount[];
  selectedShipmentForLabel: Shipment;
  setSelectedShipmentForLabel: (shipment: Shipment) => void;
  searchTrackingCode: string;
  setSearchTrackingCode: (code: string) => void;
  trackedShipment: Shipment | null;
  setTrackedShipment: (shipment: Shipment | null) => void;
  trackingNotFound: boolean;
  setTrackingNotFound: (notFound: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  adminSearchTerm: string;
  setAdminSearchTerm: (term: string) => void;
  handleTrackingSearch: (codeToSearch?: string) => void;
  addShipment: (newShipment: Shipment) => void;
  assignCourier: (shipmentId: string, courierName: string) => void;
  approvePrice: (shipmentId: string, priceNum: number) => void;
  advanceStatus: (shipmentId: string) => void;
  openPrintLabel: (shipment: Shipment) => void;
}

const CargoContext = createContext<CargoContextType | undefined>(undefined);

export const CargoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('wizard');
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [corporateAccounts] = useState<CorporateAccount[]>(CORPORATE_ACCOUNTS);
  const [selectedShipmentForLabel, setSelectedShipmentForLabel] = useState<Shipment>(
    INITIAL_SHIPMENTS[0]
  );
  const [searchTrackingCode, setSearchTrackingCode] = useState<string>('');
  const [trackedShipment, setTrackedShipment] = useState<Shipment | null>(INITIAL_SHIPMENTS[0]);
  const [trackingNotFound, setTrackingNotFound] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Tümü');
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTrackingSearch = (codeToSearch?: string) => {
    const code = (codeToSearch ?? searchTrackingCode).trim().toUpperCase();
    if (!code) return;
    const found = shipments.find((s) => s.id.toUpperCase() === code);
    if (found) {
      setTrackedShipment(found);
      setTrackingNotFound(false);
      setActiveTab('tracking');
    } else {
      setTrackingNotFound(true);
      setActiveTab('tracking');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTrackingCode = params.get('tracking');
      if (urlTrackingCode) {
        const cleanCode = urlTrackingCode.trim().toUpperCase();
        setSearchTrackingCode(cleanCode);
        const found = INITIAL_SHIPMENTS.find((s) => s.id.toUpperCase() === cleanCode);
        if (found) {
          setTrackedShipment(found);
          setTrackingNotFound(false);
        } else {
          setTrackingNotFound(true);
        }
        setActiveTab('tracking');
      }
    }
  }, []);

  const addShipment = (newShipment: Shipment) => {
    setShipments((prev) => [newShipment, ...prev]);
    setSelectedShipmentForLabel(newShipment);
    showToast(`"${newShipment.id}" takip kodlu gönderi talebi başarıyla oluşturuldu!`);
  };

  const assignCourier = (shipmentId: string, courierName: string) => {
    setShipments((prev) =>
      prev.map((item) =>
        item.id === shipmentId
          ? {
              ...item,
              courier: courierName,
              status: item.status === 'Talep Alındı' ? 'Kurye Atandı' : item.status,
              timeline: [
                ...item.timeline,
                { title: `Kurye Yönlendirildi: ${courierName}`, time: 'Şimdi', done: true },
              ],
            }
          : item
      )
    );
    showToast(`${shipmentId} için kurye atandı: ${courierName}`);
  };

  const approvePrice = (shipmentId: string, priceNum: number) => {
    setShipments((prev) =>
      prev.map((item) =>
        item.id === shipmentId
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
      `${shipmentId} için ${priceNum} ₺ fiyat onaylandı ve müşteriye SMS/Mail bildirildi!`
    );
  };

  const advanceStatus = (shipmentId: string) => {
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

  const openPrintLabel = (shipment: Shipment) => {
    setSelectedShipmentForLabel(shipment);
    setActiveTab('label');
  };

  return (
    <CargoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        shipments,
        setShipments,
        corporateAccounts,
        selectedShipmentForLabel,
        setSelectedShipmentForLabel,
        searchTrackingCode,
        setSearchTrackingCode,
        trackedShipment,
        setTrackedShipment,
        trackingNotFound,
        setTrackingNotFound,
        toastMessage,
        showToast,
        filterStatus,
        setFilterStatus,
        adminSearchTerm,
        setAdminSearchTerm,
        handleTrackingSearch,
        addShipment,
        assignCourier,
        approvePrice,
        advanceStatus,
        openPrintLabel,
      }}
    >
      {children}
    </CargoContext.Provider>
  );
};

export const useCargo = (): CargoContextType => {
  const context = useContext(CargoContext);
  if (!context) {
    throw new Error('useCargo must be used within a CargoProvider');
  }
  return context;
};

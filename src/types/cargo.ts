export type UserType = 'bireysel' | 'kurumsal' | 'misafir';

export type ActiveTab = 'wizard' | 'tracking' | 'admin' | 'label' | 'accounting';

export type ShipmentStatus =
  | 'Fiyat Onayı Bekliyor'
  | 'Talep Alındı'
  | 'Kurye Atandı'
  | 'Depoda'
  | 'Dağıtımda'
  | 'Teslim Edildi';

export interface TimelineStep {
  title: string;
  time: string;
  done: boolean;
}

export interface Shipment {
  id: string;
  senderName: string;
  senderCity: string;
  senderPhone: string;
  receiverName: string;
  receiverCity: string;
  receiverPhone: string;
  desi: number;
  weight: number;
  chargeableWeight: number;
  status: ShipmentStatus | string;
  price: number | null;
  serviceType: string;
  paymentType: string;
  createdAt: string;
  courier: string;
  timeline: TimelineStep[];
}

export interface CorporateAccount {
  id: string;
  name: string;
  balance: string;
  monthlyShipments: number;
  discount: string;
  status: 'Aktif' | 'Onay Bekliyor' | string;
}


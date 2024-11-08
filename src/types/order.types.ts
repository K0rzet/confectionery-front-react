export enum OrderStatus {
  NOVYY = 'NOVYY',
  OTMENEN = 'OTMENEN',
  SOSTAVLENIE_SPETSIFIKATSII = 'SOSTAVLENIE_SPETSIFIKATSII',
  PODTVERZHDENIE = 'PODTVERZHDENIE',
  ZAKUPKA = 'ZAKUPKA',
  PROIZVODSTVO = 'PROIZVODSTVO',
  KONTROL = 'KONTROL',
  GOTOV = 'GOTOV',
  VYPOLNEN = 'VYPOLNEN'
}

export enum UserRole {
  ZAKAZCHIK = 'ZAKAZCHIK',
  MENEDZHER_PO_ZAKUPKAM = 'MENEDZHER_PO_ZAKUPKAM',
  DIREKTOR = 'DIREKTOR',
  MASTER = 'MASTER',
  MENEDZHER_PO_RABOTE_S_KLIENTAMI = 'MENEDZHER_PO_RABOTE_S_KLIENTAMI'
}

// Базовые интерфейсы
export interface IUser {
  id: number;
  login: string;
  polnoeImya: string;
}

export interface IRazmerIzdeliya {
  nazvanie: string;
  znachenie: number;
  edinitsaIzmereniya: string;
}

// Интерфейсы заказа
export interface IOrder {
  id: number;
  nomer: string;
  data: string;
  nazvanieZakaza: string;
  status: OrderStatus;
  stoimost: number | null;
  planovayaDataZaversheniya: string | null;
  zakazchik: IUser;
  otvetstvennyyMenedzher: IUser | null;
  izdelieId: number;
  opisanieIzdeliya?: string;
  razmeryIzdeliya: IRazmerIzdeliya[];
  primeryRabot?: string[];
}

// DTO интерфейсы
export interface CreateOrderDto {
  nazvanieZakaza: string;
  zakazchikId?: number;
  izdelieId: number;
  opisanieIzdeliya: string;
  razmeryIzdeliya: IRazmerIzdeliya[];
  primeryRabot?: string[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  prichina_otkaza?: string;
  stoimost?: number;
  planovayaDataZaversheniya?: string;
}

export interface OrderDetailsDto {
  stoimost: string;
  planovayaDataZaversheniya: string;
}
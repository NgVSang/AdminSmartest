export interface IRegistration {
  id: number;
  license_plate: string;
  address?: string;
  status?: number;
  name: string;
  url?: string;
  cost?: string;
  date?: string;
  completed_at?: string;
  isPay?: number;
}

export interface IFee {
  tariff?: number;
  serviceCost?: number;
  road_fee?: number;
  license_fee?: number;
}

export interface IRegisGroup {
  date: string;
  list_registration: IRegistration[];
}

export interface IHistoryRegistry {
  id: number;
  date: string;
  license_plate: string;
  address?: string;
  payment_date?: string;
  plan_date?: string;
  url?: string;
}

export interface IRegistrationDetail {
  id: number;
  owner_name: string;
  owner_phone: string;
  address?: string;
  date?: string;
  registry_time?: string;
  staff_id?: number;
  staff_name?: string;
  car_delivery_time?: string;
  date_birth?: string;
  id_card?: string;
  phone_number?: string;
  category_name: string;
  car_type: string;
  manufacture_at: number;
  carImages: string[];
  userImage: string;
  license_plate: string;
}

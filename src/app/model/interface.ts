export interface ResponseModel {
    result: boolean;
    message: string;
    data: any;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data: Data;
    responseTime: string;
  }
  
  export interface Data {
    token: string;
    user: IUser;
  }
  
  export interface IUser {
    id?: number;
    role_id?: number;
    company_id?: string;
    f_name?: string;
    l_name?: string;
    username?: string;
    email?: string;
    email_verified_at?: string;
    order?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    primary_phone?: string;
    alternate_phone?: string;
    whatsapp?: string;
    alternate_email?: string;
    street_address_1?: string;
    street_address_2?: string;
    city?: string;
    town?: string;
    zip?: string;
    country?: string;
    image?: string;
    role_name?: string;
    role?: Role;
  }
  
  interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface IFetchBookingDetails {
    fetchAddresses?: boolean;
    bookingStatus?: boolean;
    passengers?: boolean;
    booking_status_id?: number;
    currency?: boolean;
    driver?: boolean;
    time?: string;
    fleet?:boolean;
    driver_status_id?: number;
  }

  interface Passenger {
    name: string;
  }

  export interface ITripType {
    distance: number;
    hours: number;
    passengers: Passenger[];
    no_of_luggage?: number;
    child_seat_count?: number;
  }
  
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../model/interface';
import { AppService } from './auth.service';
import { IFetchBookingDetails } from '../model/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  appService = inject(AppService);

  constructor(private http: HttpClient) {}

  // acceptRequest (): Observable<ResponseModel> {
  //   return this.http.get<ResponseModel>(`${environment.API_ENDPOINT}posts`);
  // }

  // rejectRequest (): Observable<any> {
  //   return this.http.get<ResponseModel>(`${environment.API_ENDPOINT}posts`);
  // }

  // changeStatus (): Observable<ResponseModel> {
  //   return this.http.get<ResponseModel>(`${environment.API_ENDPOINT}posts`);
  // }

  // startTrip(id: string): Observable<any> {
  //   return this.http.post<ResponseModel>(`${environment.API_ENDPOINT}posts`, { id });
  // }

  // upcomingStatusChange(status: string): Observable<any> {
  //   return this.http.post<ResponseModel>(`${environment.API_ENDPOINT}posts`, { status });
  // }

  // inprogressStartTrip(id: string): Observable<any> {
  //   return this.http.post<ResponseModel>(`${environment.API_ENDPOINT}posts`, { id });
  // }

  fetchBookingDetails(options: IFetchBookingDetails = {}): Observable<any> {
    const params = new URLSearchParams();

    if (options.fetchAddresses)
      params.append('withAddresses', String(options.fetchAddresses));
    if (options.bookingStatus)
      params.append('withBookingStatus', String(options.bookingStatus));
    if (options.passengers)
      params.append('withPassengers', String(options.passengers));
    if (options.booking_status_id !== undefined)
      params.append('booking_status_id', String(options.booking_status_id));
    if (options.currency)
      params.append('withCurrency', String(options.currency));
    if (options.driver) params.append('withDriver', String(options.driver));
    if (options.time) params.append('time', options.time);
    if (options.fleet) params.append('withFleet', String(options.fleet));
    if (options.driver_status_id) params.append('driver_status_id', String(options.driver_status_id));
    
    const url = `${environment.API_ENDPOINT}/api/bookings?${params.toString()}`;

    return this.http.get<ResponseModel>(url, this.appService.setHeaders());
  }

  driverStatus(): Observable<any> {
    return this.http.get(`${environment.API_ENDPOINT}/api/driver-status`);
  }

  inProgress(): Observable<any> {
    return this.http.get(
      `${environment.API_ENDPOINT}/api/drivers/booking-in-progress`,
      this.appService.setHeaders()
    );
  }

  addAdditionalCost(
    booking_id: string,
    rates: { name: string; fixed_amount: number | null }[]
  ): Observable<any> {
    return this.http.post(
      `${environment.API_ENDPOINT}/api/bookings/${booking_id}/addon-rates`,
      rates,
      this.appService.setHeaders()
    );
  }

  startBooking(
    booking_id: string,
    status_id: string,
    body?: any
  ): Observable<any> {
    return this.http.post(
      `${environment.API_ENDPOINT}/api/bookings/${booking_id}/change-status/${status_id}`,
      body,
      this.appService.setHeaders()
    );
  }
}

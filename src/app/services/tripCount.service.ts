import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripCountService {
  private pendingCountSubject = new BehaviorSubject<number>(0);
  private upcomingCountSubject = new BehaviorSubject<number>(0);

  pendingNotifications$ = this.pendingCountSubject.asObservable();
  upcomingNotifications$ = this.upcomingCountSubject.asObservable();

  constructor() {}

  updatePendingCount(pending: number) {
    this.pendingCountSubject.next(pending);
  }

  updateUpcomingCount(upcoming: number) {
    this.upcomingCountSubject.next(upcoming);
  }
}

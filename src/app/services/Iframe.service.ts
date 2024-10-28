import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IframeService {
  private iframeVisibleSubject = new BehaviorSubject<boolean>(false);
  iframeVisible$ = this.iframeVisibleSubject.asObservable();

  constructor() {}

  setIframeVisible(isVisible: boolean) {
    this.iframeVisibleSubject.next(isVisible);
  }
}

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loading.service'; 
import { Observable, throwError } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loaderService = inject(LoaderService);

  // Show loader before sending the request
  loaderService.presentLoading();

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      return throwError(() => new Error(`HTTP request failed: ${error}`));
    }),
    finalize(() => {
      // Always dismiss the loader after request completion or error
      loaderService.dismissLoading();
    })
  );
};

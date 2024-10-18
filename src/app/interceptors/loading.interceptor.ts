import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { LoaderService } from '../services/loading.service';
import { Observable, throwError } from 'rxjs';

const excludedUrls = ['/any'];

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loaderService = inject(LoaderService);

  const shouldShowLoader = !excludedUrls.some((url) => req.url.includes(url));

  if (shouldShowLoader) {
    loaderService.presentLoading();
  }

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      return throwError(() => new Error(`HTTP request failed: ${error}`));
    }),
    finalize(() => {
      if (shouldShowLoader) {
        loaderService.dismissLoading();
      }
    })
  );
};

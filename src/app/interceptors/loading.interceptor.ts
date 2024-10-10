import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, catchError } from 'rxjs/operators';
import { LoaderService } from '../services/loading.service';
import { throwError } from 'rxjs';

const excludedUrls = ["/any"];

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  
  const shouldShowLoader = !excludedUrls.some(url => req.url.includes(url));

  if (shouldShowLoader) {
    loaderService.presentLoading();
  }

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);
      return throwError(() => error);
    }),
    finalize(() => {
      if (shouldShowLoader) {
        loaderService.dismissLoading();
      }
    })
  );
};

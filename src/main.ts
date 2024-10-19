import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './app/interceptors/loading.interceptor'; 

import { FirebaseInitializerService } from './app/services/analytics/firebase-initializer.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment';
import { ScreenTrackingService, UserTrackingService, provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { DatePipe } from '@angular/common';

const firebaseInitializer = new FirebaseInitializerService();

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    FirebaseInitializerService,
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
  ],
})
  .then(async (appRef) => {
    const injector = appRef.injector.get(FirebaseInitializerService);
    await injector.initialize();
  })
  .catch((err) => console.error('Error bootstrapping application:', err));

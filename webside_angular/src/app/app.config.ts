
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';  // 添加这行
import { importProvidersFrom } from '@angular/core';        // 添加这行
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { StorageService } from './auth/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),  // 添加 withFetch()
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(MatDialogModule),  // 添加这行
    StorageService
  ]
};
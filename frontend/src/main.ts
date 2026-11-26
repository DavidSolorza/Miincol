// Punto de entrada principal de la aplicación Angular MISINCOL PDM
import '@angular/compiler';
import 'zone.js';
import { ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { registerServiceWorker } from './core/workers/registerServiceWorker';
import { sanitizeClientStorage } from './core/storage/cleanStorage';
import { AppErrorHandler } from './core/errors/app-error-handler';
import './index.css';

// Limpieza y sanitización de almacenamiento en el arranque
sanitizeClientStorage();

// Registra el Service Worker para soporte Offline-First
registerServiceWorker();

// Inicializa el componente raíz standalone (<app-root>) con diagnósticos de error en español
bootstrapApplication(AppComponent, {
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
}).catch((err) => console.error(err));

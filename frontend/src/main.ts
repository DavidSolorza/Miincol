// Punto de entrada principal de la aplicación Angular MISINCOL PDM
import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { registerServiceWorker } from './core/workers/registerServiceWorker';
import { sanitizeClientStorage } from './core/storage/cleanStorage';
import './index.css';

// Limpieza y sanitización de almacenamiento en el arranque
sanitizeClientStorage();

// Registra el Service Worker para soporte Offline-First
registerServiceWorker();

// Inicializa el componente raíz standalone (<app-root>)
bootstrapApplication(AppComponent).catch((err) => console.error(err));

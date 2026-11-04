// Punto de entrada principal de la aplicación Angular MISINCOL PDM
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { registerServiceWorker } from './core/workers/registerServiceWorker';
import './index.css';

// Registra el Service Worker para soporte Offline-First
registerServiceWorker();

// Inicializa el componente raíz standalone (<app-root>)
bootstrapApplication(AppComponent).catch((err) => console.error(err));

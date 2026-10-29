import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { registerServiceWorker } from './core/workers/registerServiceWorker';
import './index.css';

registerServiceWorker();

bootstrapApplication(AppComponent).catch((err) => console.error(err));

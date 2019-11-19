import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { StoreMaintenanceModule } from './store-maintenance.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(StoreMaintenanceModule)
    .catch(err => console.error(err));

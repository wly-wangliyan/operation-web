import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { OrderParkingModule } from './order-parking.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(OrderParkingModule)
  .catch(err => console.error(err));

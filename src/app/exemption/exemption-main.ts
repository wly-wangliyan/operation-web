import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { ExemptionModule } from './exemption.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ExemptionModule)
  .catch(err => console.error(err));

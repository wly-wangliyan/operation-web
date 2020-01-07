import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { initializer } from '../initializer';
import { StoreMaintenanceRoutingModule } from './store-maintenance-routing.module';
import { StoreMaintenanceComponent } from './store-maintenance.component';
import zh from '@angular/common/locales/zh';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { HomeModule } from '../home/home.module';

registerLocaleData(zh);

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    HomeModule,
    StoreMaintenanceRoutingModule,
  ],
  declarations: [
    StoreMaintenanceComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  bootstrap: [StoreMaintenanceComponent]
})
export class StoreMaintenanceModule {
}

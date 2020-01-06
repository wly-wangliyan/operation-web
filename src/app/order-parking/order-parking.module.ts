import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { initializer } from '../initializer';

import zh from '@angular/common/locales/zh';
import { OrderParkingRoutingModule } from './order-parking-routing.module';
import { OrderParkingEntryComponent } from './order-parking-entry/order-parking-entry.component';
import { OrderParkingComponent } from './order-parking.component';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';

registerLocaleData(zh);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    OrderParkingRoutingModule,
  ],
  declarations: [
    OrderParkingEntryComponent,
    OrderParkingComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  bootstrap: [OrderParkingEntryComponent]
})
export class OrderParkingModule { }

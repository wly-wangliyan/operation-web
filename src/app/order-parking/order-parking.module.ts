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
import { OrderParkingComponent } from './order-parking.component';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { environment } from 'src/environments/environment';
import { UploadConfig, UploadService, UPLOAD_TOKEN } from '../core/upload.service';
import { HomeComponent } from '../operational-system/main/home/home.component';
import { HomeModule } from '../home/home.module';

registerLocaleData(zh);

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    HomeModule,
    OrderParkingRoutingModule,
  ],
  declarations: [
    OrderParkingComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    {
      provide: UPLOAD_TOKEN,
      useValue: uploadToken
    },
    UploadService
  ],
  bootstrap: [OrderParkingComponent]
})
export class OrderParkingModule { }

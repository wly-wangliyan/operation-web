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
import { ExemptionRoutingModule } from './exemption-routing.module';
import { ExemptionComponent } from './exemption.component';
import { ServiceConfigComponent } from './service-config/service-config.component';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { environment } from 'src/environments/environment';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../core/upload.service';
import { HomeModule } from '../home/home.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    ExemptionRoutingModule,
    NzSpinModule,
    NzSwitchModule,
    NzButtonModule
  ],
  declarations: [
    ExemptionComponent,
    ServiceConfigComponent
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
  bootstrap: [ExemptionComponent]
})
export class ExemptionModule { }

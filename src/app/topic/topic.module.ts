import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { initializer } from '../initializer';
import { TopicRoutingModule } from './topic-routing.module';
import { TopicComponent } from './topic.component';
import zh from '@angular/common/locales/zh';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { HomeModule } from '../home/home.module';
import { UploadConfig, UPLOAD_TOKEN, UploadService } from '../core/upload.service';
import { environment } from 'src/environments/environment';

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
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ShareModule,
    HomeModule,
    TopicRoutingModule,
  ],
  declarations: [
    TopicComponent,
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
  bootstrap: [TopicComponent]
})
export class TopicModule {
}

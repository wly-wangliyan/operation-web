import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { ShareModule } from '../share/share.module';
import { initializer } from '../initializer';
import { OperationalSystemRoutingModule } from './operational-system-routing.module';
import { EntryComponent } from './entry/entry.component';
import { OperationalSystemComponent } from './operational-system.component';
import zh from '@angular/common/locales/zh';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { UploadConfig, UploadService, UPLOAD_TOKEN} from '../core/upload.service';
import { environment } from '../../environments/environment';

const uploadToken: UploadConfig = {
    img_config: {
        reportProcess: true,
        url: `${environment.STORAGE_DOMAIN}/storages/images`,
        source: 'park',
    },
};
registerLocaleData(zh);

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ShareModule,
        OperationalSystemRoutingModule,
        NzBadgeModule,
        NzButtonModule
    ],
    declarations: [
        EntryComponent,
        OperationalSystemComponent,
    ],
    providers: [
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true},
        {provide: ErrorHandler, useClass: SentryErrorHandler},
        {
            provide: UPLOAD_TOKEN,
            useValue: uploadToken
        },
        UploadService
    ],
    bootstrap: [EntryComponent]
})
export class OperationalSystemModule {
}

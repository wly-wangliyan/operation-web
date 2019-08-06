import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EntryComponent } from './entry/entry.component';
import { ShareModule } from './share/share.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { initializer } from './initializer';
import { environment } from '../environments/environment';
import zh from '@angular/common/locales/zh';
import * as Sentry from '@sentry/browser';

registerLocaleData(zh);

export class SentryErrorHandler implements ErrorHandler {

    constructor() {
        switch (environment.version) {
            case 'd':
                Sentry.init({
                    dsn: 'https://7fbfde3dd06e42a381f9f0e1fd630347@guard.uucin.com/217'
                });
                break;
            case 'r':
                Sentry.init({
                    dsn: 'https://9289f44a2da1424dbf63b6e014de9e41@guard.uucin.com/219'
                });
                break;
        }
    }

    handleError(error: any): void {
        if (environment.version === 'd' || environment.version === 'r') {
            // 部署到服务器上的版本才生成日志
            Sentry.captureException(error.originalError || error);
        }
        throw error;
    }
}

@NgModule({
    declarations: [
        AppComponent,
        EntryComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        ShareModule,
        NgZorroAntdModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    providers: [
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true},
        {provide: ErrorHandler, useClass: SentryErrorHandler}
    ],
    bootstrap: [EntryComponent]
})
export class AppModule {
}

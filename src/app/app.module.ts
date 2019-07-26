import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {EntryComponent} from './entry/entry.component';
import {ShareModule} from './share/share.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {initializer} from './initializer';
import {environment} from '../environments/environment';
import * as Raven from 'raven-js';

registerLocaleData(zh);

export class RavenErrorHandler implements ErrorHandler {

  constructor() {
    switch (environment.version) {
      case 'd':
        Raven
          .config('https://b0573e182a884e06bdb21396dfbdef28@guard.uucin.com/86')
          .install();
        break;
      case 'r':
        Raven
          .config('https://8cf97182b30444b486aca8c26c6c67a4@guard.uucin.com/87')
          .install();
        break;
    }
  }

  handleError(err: any): void {
    if (environment.version === 'd' ||
      environment.version === 'r') {
      // 部署到服务器上的版本才生成日志
      Raven.captureException(err);
    }
    throw err;
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
  providers: [{ provide: NZ_I18N, useValue: zh_CN },
    {provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true},
    {provide: ErrorHandler, useClass: RavenErrorHandler}],
  bootstrap: [EntryComponent]
})
export class AppModule { }

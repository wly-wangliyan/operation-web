import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { initializer } from '../initializer';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginHttpService } from './login-http.service';
import zh from '@angular/common/locales/zh';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';

registerLocaleData(zh);

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LoginRoutingModule,
  ],
  declarations: [LoginComponent],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    LoginHttpService
  ],
  bootstrap: [LoginComponent]
})
export class LoginModule {
}

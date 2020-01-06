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
import { TopicEntryComponent } from './topic-entry/topic-entry.component';
import { TopicComponent } from './topic.component';
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
        ShareModule,
        TopicRoutingModule,
    ],
    declarations: [
        TopicEntryComponent,
        TopicComponent,
    ],
    providers: [
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true},
        {provide: ErrorHandler, useClass: SentryErrorHandler}
    ],
    bootstrap: [TopicEntryComponent]
})
export class TopicModule {
}

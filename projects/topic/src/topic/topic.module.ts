import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';

import { TopicComponent } from './topic.component';
import { initializer } from 'src/app/initializer';
import { SentryErrorHandler } from 'src/utils/sentry-error-handler';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  declarations: [
    TopicComponent
  ],
  imports: [
    BrowserModule,
    ShareModule,
  ],
  providers: [{ provide: APP_INITIALIZER, useFactory: initializer.boot, multi: true },
  { provide: ErrorHandler, useClass: SentryErrorHandler }],
  bootstrap: [TopicComponent]
})
export class TopicModule { }

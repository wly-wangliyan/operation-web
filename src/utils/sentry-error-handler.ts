import { ErrorHandler } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Sentry from '@sentry/browser';

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

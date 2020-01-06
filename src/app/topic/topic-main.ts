import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../environments/environment';
import { TopicModule } from './topic.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(TopicModule)
    .catch(err => console.error(err));

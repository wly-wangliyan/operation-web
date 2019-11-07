import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { MallRoutingModule } from './mall-routing.module';
import { MallComponent } from './mall.component';

const uploadToken: UploadConfig = {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park'
};

@NgModule({
    imports: [
        ShareModule,
        HttpClientModule,
        MallRoutingModule,
    ],
    declarations: [
        MallComponent,
    ],
    providers: [
        {provide: UPLOAD_TOKEN, useValue: uploadToken},
        UploadService
    ]
})
export class MallModule {
}

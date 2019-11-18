import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { MallRoutingModule } from './mall-routing.module';
import { MallComponent } from './mall.component';
import { MainModule } from '../main/main.module';

const uploadToken: UploadConfig = {
    img_config: {
        reportProcess: true,
        url: `${environment.STORAGE_DOMAIN}/storages/images`,
        source: 'park',
    },
    video_config: {
        reportProcess: true,
        url: `${environment.STORAGE_DOMAIN}/storages/mall/videos`,
        source: 'park',
    },
};

@NgModule({
    imports: [
        ShareModule,
        HttpClientModule,
        MallRoutingModule,
        MainModule
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

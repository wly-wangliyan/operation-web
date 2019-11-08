import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { MaintenanceComponent } from './maintenance.component';

const uploadToken: UploadConfig = {
    img_config: {
        reportProcess: true,
        url: `${environment.STORAGE_DOMAIN}/storages/images`,
        source: 'park',
    },
};

@NgModule({
    imports: [
        ShareModule,
        MaintenanceRoutingModule,
        HttpClientModule,
    ],
    declarations: [
        MaintenanceComponent,
    ],
    providers: [{
        provide: UPLOAD_TOKEN,
        useValue: uploadToken
    },
        UploadService]
})
export class MaintenanceModule {
}

import { NgModule } from '@angular/core';
import { ShareModule } from '../../share/share.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { OperationComponent } from './operation.component';
import { OperationRoutingModule } from './operation-routing.module';
import { MainModule } from '../../operational-system/main/main.module';

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
        DragDropModule,
        HttpClientModule,
        OperationRoutingModule,
        MainModule
    ],
    declarations: [
        OperationComponent,
    ],
    providers: [{
        provide: UPLOAD_TOKEN,
        useValue: uploadToken
    },
        UploadService]
})
export class OperationModule {
}

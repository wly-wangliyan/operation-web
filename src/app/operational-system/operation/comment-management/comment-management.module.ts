import { NgModule } from '@angular/core';
import { ShareModule } from '../../../share/share.module';
import { CommentManagementRoutingModule } from './comment-management-routing.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../../core/upload.service';
import { environment } from '../../../../environments/environment';
import { CommentManagementComponent } from './comment-management.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentDetailComponent } from './comment-detail/comment-detail.component';
import { CommentSettingComponent } from './comment-setting/comment-setting.component';
import { CommentCreateComponent } from './comment-create/comment-create.component';

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
        CommentManagementRoutingModule,
        ColorPickerModule,
        DragDropModule,
        HttpClientModule,
    ],
    declarations: [
        CommentManagementComponent,
        CommentListComponent,
        CommentDetailComponent,
        CommentSettingComponent,
        CommentCreateComponent
    ],
    providers: [{
        provide: UPLOAD_TOKEN,
        useValue: uploadToken
    },
        UploadService]
})
export class CommentManagementModule {
}
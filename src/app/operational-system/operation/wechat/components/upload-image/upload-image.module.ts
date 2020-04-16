import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadImageComponent } from './upload-image.component';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../../../../core/upload.service';
import { environment } from '../../../../../../environments/environment';
import { NzButtonModule } from 'ng-zorro-antd/button';

const wxUploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.OPERATION_SERVE}/wx/media/upload`,
    source: 'park',
  },
};

@NgModule({
  declarations: [UploadImageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule
  ],
  exports: [
    UploadImageComponent
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: wxUploadToken
  },
    UploadService]
})
export class UploadImageModule { }

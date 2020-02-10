import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UPLOAD_TOKEN,
  UploadConfig,
  UploadService
} from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { ShareModule } from '../../share/share.module';
import { BrandManagementRoutingModule } from './brand-management-routing.module';
import { BrandManagementComponent } from './brand-management.component';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandManagementHttpService } from './brand-management-http.service';
import { BrandEditComponent } from './brand-list/brand-edit/brand-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park'
  }
};

@NgModule({
  imports: [
    NzTableModule,
    CommonModule,
    ShareModule,
    BrandManagementRoutingModule,
    NzButtonModule
  ],
  declarations: [
    BrandManagementComponent,
    BrandListComponent,
    BrandEditComponent
  ],
  providers: [
    {
      provide: UPLOAD_TOKEN,
      useValue: uploadToken
    },
    UploadService,
    BrandManagementHttpService
  ]
})
export class BrandManagementModule {}

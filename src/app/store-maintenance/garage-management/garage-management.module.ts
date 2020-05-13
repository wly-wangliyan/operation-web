import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { environment } from '../../../environments/environment';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { GarageManagementRoutingModule } from './garage-management-routing.module';
import { GarageManagementComponent } from './garage-management.component';
import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageEditComponent } from './garage-edit/garage-edit.component';
import { SupplyConfigListComponent } from './supply-config-list/supply-config-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { StoreShareModule } from '../share/store-share.module';
import { TechnicianListComponent } from './technician-list/technician-list.component';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};
@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    GarageManagementRoutingModule,
    NzTableModule,
    NzSwitchModule,
    NzButtonModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSpinModule,
    StoreShareModule
  ],
  declarations: [
    GarageManagementComponent,
    GarageListComponent,
    GarageEditComponent,
    SupplyConfigListComponent,
    TechnicianListComponent,
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class GarageManagementModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceFeesManagementRoutingModule } from './service-fees-management-routing.module';
import { ServiceFeesManagementComponent } from './service-fees-management.component';
import { ServiceFeesListComponent } from './service-fees-list/service-fees-list.component';
import { ServiceFeesManagementService } from './service-fees-management.service';
import { RescueFeesEditComponent } from './rescue-fees-edit/rescue-fees-edit.component';
import { WorkFeesEditComponent } from './work-fees-edit/work-fees-edit.component';
import { WashCarServiceEditComponent } from './wash-car-service-edit/wash-car-service-edit.component';
import { ChooseProjectComponent } from './work-fees-edit/choose-project/choose-project.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { StoreShareModule } from '../share/store-share.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { WashCarActivityEditComponent } from './wash-car-activity-edit/wash-car-activity-edit.component';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';
import { TimeSlotComponent } from './time-slot/time-slot.component';

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
    ServiceFeesManagementRoutingModule,
    NzTabsModule,
    NzFormModule,
    NzTableModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    NzSwitchModule,
    NzSpinModule,
    StoreShareModule,
    NzDatePickerModule
  ],
  declarations: [
    ServiceFeesManagementComponent,
    ServiceFeesListComponent,
    RescueFeesEditComponent,
    WorkFeesEditComponent,
    ChooseProjectComponent,
    WashCarServiceEditComponent,
    WashCarActivityEditComponent,
    TimeSlotComponent,
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService,
    ServiceFeesManagementService]
})
export class ServiceFeesManagementModule {
}

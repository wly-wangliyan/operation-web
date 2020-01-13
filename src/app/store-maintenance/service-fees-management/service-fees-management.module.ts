import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceFeesManagementRoutingModule } from './service-fees-management-routing.module';
import { ServiceFeesManagementComponent } from './service-fees-management.component';
import { ServiceFeesListComponent } from './service-fees-list/service-fees-list.component';
import { ServiceFeesManagementService } from './service-fees-management.service';
import { RescueFeesEditComponent } from './rescue-fees-edit/rescue-fees-edit.component';
import { WashCarServiceEditComponent } from './wash-car-service-edit/wash-car-service-edit.component';
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
    WashCarServiceEditComponent,
  ],
  providers: [
    ServiceFeesManagementService,
  ]
})
export class ServiceFeesManagementModule {
}

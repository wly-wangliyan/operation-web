import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { ServiceFeesManagementRoutingModule } from './service-fees-management-routing.module';
import { ServiceFeesManagementComponent } from './service-fees-management.component';
import { ServiceFeesListComponent } from './service-fees-list/service-fees-list.component';
import { ServiceFeesManagementService } from './service-fees-management.service';
import { RescueFeesEditComponent } from './rescue-fees-edit/rescue-fees-edit.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
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
    NzButtonModule
  ],
  declarations: [
    ServiceFeesManagementComponent,
    ServiceFeesListComponent,
    RescueFeesEditComponent,
  ],
  providers: [
    ServiceFeesManagementService,
  ]
})
export class ServiceFeesManagementModule {
}

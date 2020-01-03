import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { VehicleManagementRoutingModule } from './vehicle-management-routing.module';
import { VehicleManagementComponent } from './vehicle-management.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    VehicleManagementRoutingModule,
    NzTableModule,
    NzSwitchModule,
    NzButtonModule
  ],
  declarations: [
    VehicleManagementComponent,
    VehicleListComponent,
    VehicleEditComponent,
  ],
  providers: [
  ]
})
export class VehicleManagementModule {
}

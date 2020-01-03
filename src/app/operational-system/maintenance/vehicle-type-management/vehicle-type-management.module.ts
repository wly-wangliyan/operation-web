import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { VehicleTypeManagementRoutingModule } from './vehicle-type-management-routing.module';
import { VehicleTypeManagementComponent } from './vehicle-type-management.component';
import { VehicleTypeListComponent } from './vehicle-type-list/vehicle-type-list.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@NgModule({
  declarations: [
    VehicleTypeManagementComponent,
    VehicleTypeListComponent],
  imports: [
    ShareModule,
    CommonModule,
    VehicleTypeManagementRoutingModule,
    NzTreeModule,
    NzEmptyModule,
    NzSwitchModule,
    NzSpinModule,
  ]
})
export class VehicleTypeManagementModule { }

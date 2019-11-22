import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { VehicleTypeManagementRoutingModule } from './vehicle-type-management-routing.module';
import { VehicleTypeManagementComponent } from './vehicle-type-management.component';
import { VehicleTypeListComponent } from './vehicle-type-list/vehicle-type-list.component';

@NgModule({
  declarations: [
    VehicleTypeManagementComponent,
    VehicleTypeListComponent],
  imports: [
    ShareModule,
    CommonModule,
    VehicleTypeManagementRoutingModule
  ]
})
export class VehicleTypeManagementModule { }

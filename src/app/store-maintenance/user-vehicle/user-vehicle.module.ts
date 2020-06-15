import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { UserVehicleRoutingModule } from './user-vehicle-routing.module';
import { UserVehicleComponent } from './user-vehicle.component';
import { UserVehicleListComponent } from './user-vehicle-list/user-vehicle-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [UserVehicleComponent, UserVehicleListComponent],
  imports: [
    CommonModule,
    UserVehicleRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
  ]
})
export class UserVehicleModule { }

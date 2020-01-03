import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { GarageManagementRoutingModule } from './garage-management-routing.module';
import { GarageManagementComponent } from './garage-management.component';
import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageEditComponent } from './garage-edit/garage-edit.component';
import { SupplyConfigListComponent } from './supply-config-list/supply-config-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    GarageManagementRoutingModule,
    NzTableModule,
    NzSwitchModule,
    NzButtonModule
  ],
  declarations: [
    GarageManagementComponent,
    GarageListComponent,
    GarageEditComponent,
    SupplyConfigListComponent,
  ],
  providers: [
  ]
})
export class GarageManagementModule { }

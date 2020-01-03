import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { ShareModule } from '../../../share/share.module';
import { BusinessManagementRoutingModule } from './business-management-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    BusinessManagementRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzSwitchModule,
    NzCheckboxModule
  ],
  declarations: [
    BusinessManagementComponent,
    BusinessListComponent,
    BusinessEditComponent
  ],
  providers: []
})
export class BusinessManagementModule { }

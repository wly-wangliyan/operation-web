import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { ShareModule } from '../../../share/share.module';
import { BusinessManagementRoutingModule } from './business-management-routing.module';

@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    BusinessManagementRoutingModule,
  ],
  declarations: [
    BusinessManagementComponent,
    BusinessListComponent,
    BusinessEditComponent
  ],
  providers: []
})
export class BusinessManagementModule { }

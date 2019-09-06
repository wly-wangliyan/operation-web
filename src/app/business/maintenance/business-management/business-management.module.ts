import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { BusinessManagementRoutingModule } from './business-management-routing.module';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessListComponent } from './business-list/business-list.component';

@NgModule({
  declarations: [
    BusinessManagementComponent,
    BusinessListComponent],
  imports: [
    ShareModule,
    CommonModule,
    BusinessManagementRoutingModule
  ]
})
export class BusinessManagementModule { }

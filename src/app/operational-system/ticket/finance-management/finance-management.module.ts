import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { FinanceManagementRoutingModule } from './finance-management-routing.module';
import { FinanceManagementComponent } from './finance-management.component';
import { PaySettingComponent } from './pay-setting/pay-setting.component';


@NgModule({
  declarations: [
    FinanceManagementComponent,
    PaySettingComponent],
  imports: [
    ShareModule,
    CommonModule,
    FinanceManagementRoutingModule
  ]
})
export class FinanceManagementModule { }

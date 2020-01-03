import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { FinanceManagementRoutingModule } from './finance-management-routing.module';
import { FinanceManagementComponent } from './finance-management.component';
import { PaySettingComponent } from './pay-setting/pay-setting.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
@NgModule({
  declarations: [
    FinanceManagementComponent,
    PaySettingComponent],
  imports: [
    ShareModule,
    CommonModule,
    FinanceManagementRoutingModule,
    NzSpinModule,
    NzRadioModule,
    NzButtonModule
  ]
})
export class FinanceManagementModule { }

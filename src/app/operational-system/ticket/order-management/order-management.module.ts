import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { OrderManagementRoutingModule } from './order-management-routing.module';
import { OrderManagementComponent } from './order-management.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    OrderManagementComponent,
    OrderListComponent,
    OrderDetailComponent],
  imports: [
    ShareModule,
    CommonModule,
    OrderManagementRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSpinModule,
  ]
})
export class OrderManagementModule { }

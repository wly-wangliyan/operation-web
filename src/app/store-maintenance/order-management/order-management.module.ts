import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { OrderManagementRoutingModule } from './order-management-routing.module';
import { OrderManagementComponent } from './order-management.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  declarations: [OrderManagementComponent, OrderListComponent, OrderDetailComponent],
  imports: [
    ShareModule,
    CommonModule,
    OrderManagementRoutingModule
  ]
})
export class OrderManagementModule { }

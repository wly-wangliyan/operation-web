import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { OrderManagementRoutingModule } from './order-management-routing.module';
import { OrderManagementComponent } from './order-management.component';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [OrderManagementComponent, OrderListComponent],
  imports: [
    ShareModule,
    CommonModule,
    OrderManagementRoutingModule
  ]
})
export class OrderManagementModule { }

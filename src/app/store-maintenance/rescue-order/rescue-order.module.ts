import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { RescueOrderRoutingModule } from './rescue-order-routing.module';
import { RescueOrderComponent } from './rescue-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';


@NgModule({
  declarations: [RescueOrderComponent, OrderListComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    RescueOrderRoutingModule,
    ShareModule
  ]
})
export class RescueOrderModule { }

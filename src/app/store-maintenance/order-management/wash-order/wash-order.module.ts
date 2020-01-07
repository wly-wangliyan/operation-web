import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WashOrderRoutingModule } from './wash-order-routing.module';
import { WashOrderComponent } from './wash-order.component';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [WashOrderComponent, OrderListComponent],
  imports: [
    CommonModule,
    WashOrderRoutingModule
  ]
})
export class WashOrderModule { }

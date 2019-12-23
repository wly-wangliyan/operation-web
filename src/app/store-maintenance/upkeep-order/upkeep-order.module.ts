import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpkeepOrderRoutingModule } from './upkeep-order-routing.module';
import { UpkeepOrderComponent } from './upkeep-order.component';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [UpkeepOrderComponent, OrderListComponent],
  imports: [
    CommonModule,
    UpkeepOrderRoutingModule
  ]
})
export class UpkeepOrderModule { }

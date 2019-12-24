import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { UpkeepOrderRoutingModule } from './upkeep-order-routing.module';
import { UpkeepOrderComponent } from './upkeep-order.component';
import { OrderListComponent } from './order-list/order-list.component';


@NgModule({
  declarations: [UpkeepOrderComponent, OrderListComponent],
  imports: [
    CommonModule,
    UpkeepOrderRoutingModule,
    ShareModule
  ]
})
export class UpkeepOrderModule { }

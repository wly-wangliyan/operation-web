import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../share/share.module';
import { UpkeepOrderRoutingModule } from './upkeep-order-routing.module';
import { UpkeepOrderComponent } from './upkeep-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { BatteryDetailComponent } from './battery-detail/battery-detail.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { StoreShareModule } from '../share/store-share.module';
import { ArrivalOrderDetailComponent } from './arrival-order-detail/arrival-order-detail.component';
@NgModule({
  declarations: [UpkeepOrderComponent, OrderListComponent, BatteryDetailComponent, ArrivalOrderDetailComponent],
  imports: [
    CommonModule,
    UpkeepOrderRoutingModule,
    ShareModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule,
    StoreShareModule
  ]
})
export class UpkeepOrderModule { }

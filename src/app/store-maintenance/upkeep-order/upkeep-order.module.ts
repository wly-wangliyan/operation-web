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
@NgModule({
  declarations: [UpkeepOrderComponent, OrderListComponent, BatteryDetailComponent],
  imports: [
    CommonModule,
    UpkeepOrderRoutingModule,
    ShareModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule
  ]
})
export class UpkeepOrderModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { WashOrderRoutingModule } from './wash-car-order-routing.module';
import { WashOrderComponent } from './wash-car-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { WashCarOrderStatusPipe } from './pipes/wash-car-order-status.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [WashOrderComponent, OrderListComponent, WashCarOrderStatusPipe],
  imports: [
    CommonModule,
    WashOrderRoutingModule,
    ShareModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule
  ]
})
export class WashOrderModule { }

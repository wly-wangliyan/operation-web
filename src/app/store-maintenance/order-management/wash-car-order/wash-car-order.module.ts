import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { WashOrderRoutingModule } from './wash-car-order-routing.module';
import { WashOrderComponent } from './wash-car-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ClientTypePipe, WashCarApplyStatusPipe, WashCarOrderStatusPipe } from './pipes/wash-car-order-status.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { StoreShareModule } from '../../share/store-share.module';
import { StatisticDataComponent } from './statistic-data/statistic-data.component';
import { CheckRefundComponent } from './check-refund/check-refund.component';
import { RefundListComponent } from './refund-management/refund-list/refund-list.component';

@NgModule({
  declarations: [WashOrderComponent, OrderListComponent, WashCarOrderStatusPipe, CheckRefundComponent,
    WashCarApplyStatusPipe, OrderDetailComponent, StatisticDataComponent, RefundListComponent, ClientTypePipe],
  imports: [
    CommonModule,
    WashOrderRoutingModule,
    ShareModule,
    NzTableModule,
    NzDatePickerModule,
    NzButtonModule,
    StoreShareModule
  ]
})
export class WashOrderModule { }

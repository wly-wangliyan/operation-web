import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../../share/share.module';
import { IntegralOrderRoutingModule } from './integral-order-routing.module';
import { IntegralOrderComponent } from './integral-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import {
  OrderStatusPipe,
  CommodityDeliveryStatusPipe,
  IntegralCommodityTypePipe
} from './share-pipes.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { OrderRemarkComponent } from './order-remark/order-remark.component';

@NgModule({
  declarations: [
    IntegralOrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderStatusPipe,
    CommodityDeliveryStatusPipe,
    IntegralCommodityTypePipe,
    OrderRemarkComponent],
  imports: [
    CommonModule,
    IntegralOrderRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule,
    NzCardModule
  ]
})
export class IntegralOrderModule { }

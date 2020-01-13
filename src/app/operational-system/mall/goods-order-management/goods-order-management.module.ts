import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { GoodsOrderManagementRoutingModule } from './goods-order-management-routing.module';
import { GoodsOrderManagementHttpService } from './goods-order-management-http.service';
import { GoodsOrderManagementComponent } from './goods-order-management.component';
import { GoodsOrderListComponent } from './goods-order-list/goods-order-list.component';
import { GoodsOrderDetailComponent } from './goods-order-detail/goods-order-detail.component';
import {
  ConfirmTypePipe, DeliveryStatusPipe, PayStatusPipe, RealGoodsDeliveryStatusPipe, DeliveryMethodPipe,
  RefundTypePipe, RefundStatusPipe, WriteOffStatusPipe, OrderStatusFormatPipe, PayTypePipe
} from '../mall.pipe';
import { GoodsOrderDeliveryComponent } from './goods-order-delivery/goods-order-delivery.component';
import { GoodsOrderRefundComponent } from './goods-order-refund/goods-order-refund.component';
import { GoodsOrderRemarkComponent } from './goods-order-remark/goods-order-remark.component';
import { GoodsWriteOffComponent } from './goods-write-off/goods-write-off.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    GoodsOrderManagementRoutingModule,
    NzRadioModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzCardModule
  ],
  declarations: [
    GoodsOrderManagementComponent,
    GoodsOrderListComponent,
    GoodsOrderDetailComponent,
    DeliveryStatusPipe,
    PayStatusPipe,
    ConfirmTypePipe,
    RealGoodsDeliveryStatusPipe,
    DeliveryMethodPipe,
    RefundTypePipe,
    RefundStatusPipe,
    WriteOffStatusPipe,
    OrderStatusFormatPipe,
    PayTypePipe,
    GoodsOrderDeliveryComponent,
    GoodsOrderRefundComponent,
    GoodsOrderRemarkComponent,
    GoodsWriteOffComponent
  ],
  providers: [
    GoodsOrderManagementHttpService,
  ]
})
export class GoodsOrderManagementModule {
}

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
  RefundTypePipe, RefundStatusPipe, WriteOffStatusPipe, OrderStatusFormatPipe
} from './goods-order.pipe';
import { GoodsOrderDeliveryComponent } from './goods-order-delivery/goods-order-delivery.component';
import { GoodsOrderRefundComponent } from './goods-order-refund/goods-order-refund.component';
import { GoodsOrderRemarkComponent } from './goods-order-remark/goods-order-remark.component';
import { GoodsWriteOffComponent } from './goods-write-off/goods-write-off.component';

@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    GoodsOrderManagementRoutingModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { GoodsOrderManagementRoutingModule } from './goods-order-management-routing.module';
import { GoodsOrderManagementHttpService } from './goods-order-management-http.service';
import { GoodsOrderManagementComponent } from './goods-order-management.component';
import { GoodsOrderListComponent } from './goods-order-list/goods-order-list.component';
import { GoodsOrderDetailComponent } from './goods-order-detail/goods-order-detail.component';
import { ConfirmTypePipe, DeliveryStatusPipe, PayStatusPipe } from './goods-order.pipe';
import { GoodsOrderDeliveryComponent } from './goods-order-delivery/goods-order-delivery.component';
import { GoodsOrderRefundComponent } from './goods-order-refund/goods-order-refund.component';
import { GoodsOrderRemarkComponent } from './goods-order-remark/goods-order-remark.component';

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
        GoodsOrderDeliveryComponent,
        GoodsOrderRefundComponent,
        GoodsOrderRemarkComponent
    ],
    providers: [
        GoodsOrderManagementHttpService,
    ]
})
export class GoodsOrderManagementModule {
}

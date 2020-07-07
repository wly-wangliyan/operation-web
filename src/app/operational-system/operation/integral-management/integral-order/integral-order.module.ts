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
import { OrderStatusPipe } from './share-pipes.pipe';

@NgModule({
  declarations: [
    IntegralOrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderStatusPipe],
  imports: [
    CommonModule,
    IntegralOrderRoutingModule,
    ShareModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzRadioModule
  ]
})
export class IntegralOrderModule { }

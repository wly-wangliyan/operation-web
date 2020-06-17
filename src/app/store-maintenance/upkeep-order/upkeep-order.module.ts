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
import { ExamineGoodsModalComponent } from './examine-goods-modal/examine-goods-modal.component';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../core/upload.service';
import { environment } from '../../../environments/environment';

const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  declarations: [UpkeepOrderComponent, OrderListComponent, BatteryDetailComponent, ArrivalOrderDetailComponent, ExamineGoodsModalComponent],
  imports: [
    CommonModule,
    UpkeepOrderRoutingModule,
    ShareModule,
    NzRadioModule,
    NzDatePickerModule,
    NzTableModule,
    NzButtonModule,
    StoreShareModule
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class UpkeepOrderModule { }

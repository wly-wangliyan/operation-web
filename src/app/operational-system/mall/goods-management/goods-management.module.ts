import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { GoodsManagementRoutingModule } from './goods-management-routing.module';
import { GoodsManagementComponent } from './goods-management.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsCreateComponent } from './goods-create/goods-create.component';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { GoodsManagementHttpService } from './goods-management-http.service';
import { ClassifyManagementComponent } from './classify-management/classify-management.component';
import { ClassifyEditComponent } from './classify-management/classify-edit/classify-edit.component';
import { ExchangeStatusPipe } from '../mall.pipe';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { GoodsOrderManagementModule } from '../goods-order-management/goods-order-management.module';
import { StatisticDetailComponent } from './statistic-detail/statistic-detail.component';
@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    GoodsManagementRoutingModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSpinModule,
    NzSwitchModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzRadioModule,
    NzToolTipModule,
    GoodsOrderManagementModule
  ],
  declarations: [
    GoodsManagementComponent,
    GoodsListComponent,
    GoodsCreateComponent,
    GoodsDetailComponent,
    ClassifyManagementComponent,
    ClassifyEditComponent,
    ExchangeStatusPipe,
    StatisticDetailComponent
  ],
  providers: [
    GoodsManagementHttpService,
  ]
})
export class GoodsManagementModule {
}

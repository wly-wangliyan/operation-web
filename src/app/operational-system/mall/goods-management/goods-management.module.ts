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
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    GoodsManagementRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSpinModule,
    NzSwitchModule,
    NzFormModule,
    NzCheckboxModule,
    NzInputModule,
    NzRadioModule,
    NzToolTipModule
  ],
  declarations: [
    GoodsManagementComponent,
    GoodsListComponent,
    GoodsCreateComponent,
    GoodsDetailComponent,
    ClassifyManagementComponent,
    ClassifyEditComponent
  ],
  providers: [
    GoodsManagementHttpService,
  ]
})
export class GoodsManagementModule {
}

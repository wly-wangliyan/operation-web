import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { UPLOAD_TOKEN, UploadConfig, UploadService } from '../../../core/upload.service';
import { environment } from '../../../../environments/environment';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductManagementComponent } from './product-management.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ThirdProductListComponent } from './third-product-list/third-product-list.component';
import { ThirdProductDetailComponent } from './third-product-detail/third-product-detail.component';
import { ProductCalendarComponent } from './product-edit/product-calendar/product-calendar.component';
import { CalendarDetailComponent } from './product-detail/calendar-detail/calendar-detail.component';
import { BatchImportComponent } from './product-edit/batch-import/batch-import.component';
import { LabelManagementComponent } from './label-management/label-management.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LabelEditComponent } from './label-management/label-edit/label-edit.component';
import { ChooseLabelComponent } from './product-edit/choose-label/choose-label.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzCheckboxModule } from 'ng-zorro-antd';
const uploadToken: UploadConfig = {
  img_config: {
    reportProcess: true,
    url: `${environment.STORAGE_DOMAIN}/storages/images`,
    source: 'park',
  },
};

@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductListComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductDetailComponent,
    ThirdProductListComponent,
    ThirdProductDetailComponent,
    ProductCalendarComponent,
    CalendarDetailComponent,
    BatchImportComponent,
    LabelManagementComponent,
    LabelEditComponent,
    ChooseLabelComponent],
  imports: [
    ShareModule,
    DragDropModule,
    CommonModule,
    ProductManagementRoutingModule,
    NzTableModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSpinModule,
    NzFormModule,
    NzCalendarModule,
    NzInputModule,
    NzTabsModule,
    NzBackTopModule,
    NzCheckboxModule
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class ProductManagementModule {
}

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
@NgModule({
  imports: [
    ShareModule,
    CommonModule,
    GoodsManagementRoutingModule,
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

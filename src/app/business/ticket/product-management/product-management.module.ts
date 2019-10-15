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
import { ProductEditor2Component } from './product-edit/product-editor2/product-editor2.component';
import { ProductEditor1Component } from './product-edit/product-editor1/product-editor1.component';
import { ProductEditor3Component } from './product-edit/product-editor3/product-editor3.component';
import { ThirdProductDetailComponent } from './third-product-detail/third-product-detail.component';

const uploadToken: UploadConfig = {
  reportProcess: true,
  url: `${environment.STORAGE_DOMAIN}/storages/images`,
  source: 'park'
};

@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductListComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ProductDetailComponent,
    ThirdProductListComponent,
    ProductEditor2Component,
    ProductEditor1Component,
    ProductEditor3Component,
    ThirdProductDetailComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProductManagementRoutingModule
  ],
  providers: [{
    provide: UPLOAD_TOKEN,
    useValue: uploadToken
  },
    UploadService]
})
export class ProductManagementModule { }

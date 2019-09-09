import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { ProductLibraryRoutingModule } from './product-library-routing.module';
import { ProductLibraryComponent } from './product-library.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCreateComponent } from './product-create/product-create.component';


@NgModule({
  declarations: [
    ProductLibraryComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductCreateComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProductLibraryRoutingModule
  ]
})
export class ProductLibraryModule { }

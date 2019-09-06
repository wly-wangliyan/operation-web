import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { ProductLibraryRoutingModule } from './product-library-routing.module';
import { ProductLibraryComponent } from './product-library.component';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({
  declarations: [ProductLibraryComponent, ProductListComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProductLibraryRoutingModule
  ]
})
export class ProductLibraryModule { }

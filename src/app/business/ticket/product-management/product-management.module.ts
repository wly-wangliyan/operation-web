import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    ProductManagementRoutingModule
  ]
})
export class ProductManagementModule { }

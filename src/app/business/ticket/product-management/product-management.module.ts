import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../../../share/share.module';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductManagementComponent } from './product-management.component';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductListComponent],
  imports: [
    ShareModule,
    CommonModule,
    ProductManagementRoutingModule
  ]
})
export class ProductManagementModule { }

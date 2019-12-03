import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierManagementComponent } from './supplier-management.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';
import { WarehouseEditComponent } from './warehouse-edit/warehouse-edit.component';
import { ShareModule } from '../../share/share.module';
import { SupplierManagementRoutingModule } from './supplier-management-routing.module';



@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    SupplierManagementRoutingModule
  ],
  declarations: [
    SupplierManagementComponent,
    SupplierListComponent,
    WarehouseListComponent,
    WarehouseEditComponent,
  ],
  providers: [
  ]
})
export class SupplierManagementModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { SupplierManagementComponent } from './supplier-management.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { WarehouseEditComponent } from './warehouse-edit/warehouse-edit.component';
import { WarehouseListComponent } from './warehouse-list/warehouse-list.component';

const routes: Routes = [
  {
    path: '', component: SupplierManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      {path: '', redirectTo: 'supplier-list', pathMatch: 'full'},
      {path: 'supplier-list', component: SupplierListComponent},
      {path: 'supplier-list/:supplier_id/warehouse-list', component: WarehouseListComponent},
      {path: 'supplier-list/:supplier_id/warehouse-edit/:warehouse_id', component: WarehouseEditComponent},
      {path: '**', redirectTo: 'supplier-list', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierManagementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { MenuGuardService } from '../core/menu-guard.service';
import { StoreMaintenanceComponent } from './store-maintenance.component';

const routes: Routes = [
  {
    path: 'accessory-library',
    loadChildren: () => import('./accessory-library/accessory-library.module').then(m => m.AccessoryLibraryModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'brand-management',
    loadChildren: () => import('./brand-management/brand-management.module').then(m => m.BrandManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'order-management',
    loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'service-fees-management',
    loadChildren: () => import('./service-fees-management/service-fees-management.module').then(m => m.ServiceFeesManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'vehicle-management',
    loadChildren: () => import('./vehicle-management/vehicle-management.module').then(m => m.VehicleManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'project-management',
    loadChildren: () => import('./project-management/project-management.module').then(m => m.ProjectManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'garage-management',
    loadChildren: () => import('./garage-management/garage-management.module').then(m => m.GarageManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'supplier-management',
    loadChildren: () => import('./supplier-management/supplier-management.module').then(m => m.SupplierManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'expect-wash-car',
    loadChildren: () => import('./expect-wash-car-shop/expect-wash-car-shop.module').then(m => m.ExpectWashCarShopModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'rescue-order',
    loadChildren: () => import('./rescue-order/rescue-order.module').then(m => m.RescueOrderModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'upkeep-order',
    loadChildren: () => import('./upkeep-order/upkeep-order.module').then(m => m.UpkeepOrderModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'expense-management',
    loadChildren: () => import('./expense-management/expense-management.module').then(m => m.ExpenseManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StoreMaintenanceRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MenuGuardService } from '../../core/menu-guard.service';
import { StoreMaintenanceMainComponent } from './store-maintenance-main.component';
import { HomeComponent } from '../../operational-system/main/home/home.component';

const routes: Routes = [{
  path: '', component: StoreMaintenanceMainComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
  children: [
    /*{path: '', redirectTo: 'brand-management', pathMatch: 'full'},*/
    { path: 'home', component: HomeComponent },
    {
      path: 'accessory-library',
      loadChildren: () => import('../accessory-library/accessory-library.module').then(m => m.AccessoryLibraryModule),
    },
    {
      path: 'brand-management',
      loadChildren: () => import('../brand-management/brand-management.module').then(m => m.BrandManagementModule),
    },
    {
      path: 'order-management',
      loadChildren: () => import('../order-management/order-management.module').then(m => m.OrderManagementModule),
    },
    {
      path: 'work-fees-management',
      loadChildren: () => import('../work-fees-management/work-fees-management.module').then(m => m.WorkFeesManagementModule),
    },
    {
      path: 'vehicle-management',
      loadChildren: () => import('../vehicle-management/vehicle-management.module').then(m => m.VehicleManagementModule),
    },
    {
      path: 'project-management',
      loadChildren: () => import('../project-management/project-management.module').then(m => m.ProjectManagementModule),
    },
    {
      path: 'garage-management',
      loadChildren: () => import('../garage-management/garage-management.module').then(m => m.GarageManagementModule),
    },
    {
      path: 'supplier-management',
      loadChildren: () => import('../supplier-management/supplier-management.module').then(m => m.SupplierManagementModule),
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreMaintenanceMainRoutingModule {
}

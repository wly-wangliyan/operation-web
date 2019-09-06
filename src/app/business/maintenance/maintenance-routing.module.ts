import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MaintenanceComponent } from './maintenance.component';

const routes: Routes = [{
  path: '', component: MaintenanceComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'order-management', pathMatch: 'full' },
    {
      path: 'vehicle-type-management',
      loadChildren: () => import('./vehicle-type-management/vehicle-type-management.module').then(m => m.VehicleTypeManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'project-management',
      loadChildren: () => import('./project-managemant/project-managemant.module').then(m => m.ProjectManagemantModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'order-management',
      loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'business-management',
      loadChildren: () => import('./business-management/business-management.module').then(m => m.BusinessManagementModule),
      canLoad: [AuthGuardService]
    },
    { path: '**', redirectTo: 'order-management', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}

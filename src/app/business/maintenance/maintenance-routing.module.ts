import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MaintenanceComponent } from './maintenance.component';
import { VehicleTypeListComponent } from './vehicle-type-management/vehicle-type-list/vehicle-type-list.component';

const routes: Routes = [{
  path: '', component: MaintenanceComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'order-management', pathMatch: 'full' },
    {
      path: 'project-management', /** 保养项目管理 */
      loadChildren: () => import('./project-managemant/project-managemant.module').then(m => m.ProjectManagemantModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'order-management', /** 订单管理 */
      loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'maintenance-manual', /** 保养手册 */
      loadChildren: () => import('./maintenance-manual/maintenance-manual.module').then(m => m.MaintenanceManualModule),
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


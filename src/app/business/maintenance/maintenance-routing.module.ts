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
    { path: '', redirectTo: 'vehicle-type-list', pathMatch: 'full' },
    { path: 'vehicle-type-list', component: VehicleTypeListComponent },
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
    { path: '**', redirectTo: 'vehicle-type-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}

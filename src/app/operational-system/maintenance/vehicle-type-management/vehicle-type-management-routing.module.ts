import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { VehicleTypeListComponent } from './vehicle-type-list/vehicle-type-list.component';
import { VehicleTypeManagementComponent } from './vehicle-type-management.component';

const routes: Routes = [
  {
    path: '', component: VehicleTypeManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: VehicleTypeListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleTypeManagementRoutingModule { }

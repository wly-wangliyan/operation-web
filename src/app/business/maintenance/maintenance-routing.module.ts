import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from '../../core/auth-guard.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import { MaintenanceComponent } from './maintenance.component';
import { VehicleTypeManagementComponent } from './vehicle-type-management/vehicle-type-management.component';

const routes: Routes = [{
  path: '', component: MaintenanceComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'vehicle-type-list', pathMatch: 'full'},
    {path: 'vehicle-type-list', component: VehicleTypeManagementComponent},
    {path: 'insurance-company-list', component: VehicleTypeManagementComponent},
    {path: '**', redirectTo: 'vehicle-type-list', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule {
}

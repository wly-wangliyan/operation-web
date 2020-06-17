import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserVehicleComponent } from './user-vehicle.component';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { UserVehicleListComponent } from './user-vehicle-list/user-vehicle-list.component';


const routes: Routes = [{
  path: '', component: UserVehicleComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'user-vehicle-list', pathMatch: 'full' },
    { path: 'user-vehicle-list', component: UserVehicleListComponent },
    { path: '**', redirectTo: 'user-vehicle-list', pathMatch: 'full' }
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserVehicleRoutingModule { }

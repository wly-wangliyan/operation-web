import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from '../../core/auth-guard.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import { MxParkingComponent } from './mx-parking.component';
import { FirstPageIconComponent } from './first-page-icon/first-page-icon-list/first-page-icon.component';
import { VersionManagementComponent } from './version-management/version-management-list/version-management.component';

const routes: Routes = [{
  path: '', component: MxParkingComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'first-page-icon', pathMatch: 'full'},
    {path: 'first-page-icon', component: FirstPageIconComponent},
    {path: 'version-management', component: VersionManagementComponent},
    {path: '**', redirectTo: 'first-page-icon', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MxParkingRoutingModule {
}

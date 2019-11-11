import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { ActivityConfigComponent } from './activity-config.component';
import { ConfigListComponent } from './config-list/config-list.component';


const routes: Routes = [{
  path: '', component: ActivityConfigComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'config-list', pathMatch: 'full' },
    { path: 'config-list', component: ConfigListComponent },
    { path: '**', redirectTo: 'config-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityConfigRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { ActivityBusinessListComponent } from './activity-business-list/activity-business-list.component';
import { ActivityBusinessComponent } from './activity-business.component';
import { ActivityBusinessEditComponent } from './activity-business-edit/activity-business-edit.component';

const routes: Routes = [{
  path: '', component: ActivityBusinessComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ActivityBusinessListComponent },
    { path: 'edit/:movement_id', component: ActivityBusinessEditComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityBusinessRoutingModule { }

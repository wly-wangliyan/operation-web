import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { PushManagementComponent } from './push-management.component';
import { PushListComponent } from './push-list/push-list.component';
import { PushDetailComponent } from './push-detail/push-detail.component';

const routes: Routes = [{
  path: '', component: PushManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'push-list', pathMatch: 'full' },
    { path: 'push-list', component: PushListComponent },
    { path: 'push-detail/:push_plan_id', component: PushDetailComponent },
    { path: '**', redirectTo: 'push-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushManagementRoutingModule { }

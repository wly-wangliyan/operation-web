import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { PushListComponent } from './push-list/push-list.component';
import { PushComponent } from './push.component';
import { AddPushComponent } from './add-push/add-push.component';


const routes: Routes = [{
  path: '', component: PushComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'push-list', pathMatch: 'full' },
    { path: 'push-list', component: PushListComponent },
    { path: 'add-push', component: AddPushComponent },
    // { path: 'push-detail/:push_message_id', component: AddPushComponent },
    { path: '**', redirectTo: 'push-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushRoutingModule { }

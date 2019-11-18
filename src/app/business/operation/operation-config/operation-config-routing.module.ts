import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { OperationConfigComponent } from './operation-config.component';

const routes: Routes = [{
  path: '', component: OperationConfigComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'activity-config', pathMatch: 'full' },
    {
      path: 'activity-config',
      loadChildren: () => import('./activity-config/activity-config.module').then(m => m.ActivityConfigModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'thematic-activity',
      loadChildren: () => import('./thematic-activity/thematic-activity.module').then(m => m.ThematicActivityModule),
      canLoad: [AuthGuardService]
    },
    { path: '**', redirectTo: 'activity-config', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationConfigRoutingModule { }

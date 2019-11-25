import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { WorkFeesManagementComponent } from './work-fees-management.component';
import { WorkFeesListComponent } from './work-fees-list/work-fees-list.component';

const routes: Routes = [
  {
    path: '', component: WorkFeesManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: WorkFeesListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFeesManagementRoutingModule {
}

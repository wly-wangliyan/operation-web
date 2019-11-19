import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { NoticeManagementComponent } from '../notice-management/notice-management.component';
import { NoticeListComponent } from '../notice-management/notice-list/notice-list.component';

const routes: Routes = [{
  path: '', component: NoticeManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'notice-list', pathMatch: 'full' },
    { path: 'notice-list', component: NoticeListComponent },
    { path: '**', redirectTo: 'notice-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticeManagementRoutingModule { }

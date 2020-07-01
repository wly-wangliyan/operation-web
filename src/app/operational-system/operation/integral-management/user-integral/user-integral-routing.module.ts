import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { UserIntegralComponent } from './user-integral.component';
import { UserListComponent } from './user-list/user-list.component';


const routes: Routes = [
  {
    path: '', component: UserIntegralComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'user-list', pathMatch: 'full' },
      {
        path: 'user-list', component: UserListComponent
      },
      { path: '**', redirectTo: 'user-list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserIntegralRoutingModule { }

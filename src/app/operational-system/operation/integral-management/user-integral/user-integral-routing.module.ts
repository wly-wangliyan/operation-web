import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { UserIntegralComponent } from './user-integral.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserIntegralDetailComponent } from './user-integral-detail/user-integral-detail.component';


const routes: Routes = [
  {
    path: '', component: UserIntegralComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list', component: UserListComponent
      },
      {
        path: 'detail/:user_id', component: UserIntegralDetailComponent
      },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserIntegralRoutingModule { }

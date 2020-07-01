import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { RightsManagementComponent } from './rights-management.component';


const routes: Routes = [
  {
    path: '', component: RightsManagementComponent,
    canActivate: [AuthGuardService, RouteMonitorService],
    children: [
      {
        path: 'integral-rights', /** 积分权益 */
        loadChildren: () => import('./integral-rights/integral-rights.module').then(m => m.IntegralRightsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RightsManagementRoutingModule { }

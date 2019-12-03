import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MiniProgramComponent } from './mini-program.component';


const routes: Routes = [{
  path: '', component: MiniProgramComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'banner-management', pathMatch: 'full' },
    {
      path: 'banner-management', /** 展位管理 */
      loadChildren: () => import('./banner-management/banner-management.module').then(m => m.BannerManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'notice-management', /** 通知管理 */
      loadChildren: () => import('./notice-management/notice-management.module').then(m => m.NoticeManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'push-management', /** 推送 */
      loadChildren: () => import('./push-management/push-management.module').then(m => m.PushManagementModule),
      canLoad: [AuthGuardService]
    },
    { path: '**', redirectTo: 'banner-management', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiniProgramRoutingModule { }

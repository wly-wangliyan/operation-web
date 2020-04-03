import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MiniProgramComponent } from './mini-program.component';


const routes: Routes = [{
  path: '', component: MiniProgramComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'booth-management', pathMatch: 'full' },
    {
      path: 'booth-management', /** 展位管理 */
      loadChildren: () => import('./booth-management/booth-management.module').then(m => m.BoothManagementModule),
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
    {
      path: 'interface-decoration', /** 界面装修、草稿发布记录 */
      loadChildren: () => import('./interface-decoration/interface-decoration.module').then(m => m.InterfaceDecorationModule),
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

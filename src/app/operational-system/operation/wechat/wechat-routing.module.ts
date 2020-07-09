import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { WechatComponent } from './wechat.component';


const routes: Routes = [
  {
    path: '', component: WechatComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'push', pathMatch: 'full' },
      {
        path: 'push', /** 48小时推送 */
        loadChildren: () => import('./push/push.module').then(m => m.PushModule),
        canLoad: [AuthGuardService]
      },
      {
        path: 'push-log', /** 推送记录 */
        loadChildren: () => import('./push/push.module').then(m => m.PushModule),
        canLoad: [AuthGuardService]
      },
      {
        path: 'function-authorize', /** 功能授权 */
        loadChildren: () => import('./function-authorize/function-authorize.module').then(m => m.FunctionAuthorizeModule),
        canLoad: [AuthGuardService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WechatRoutingModule { }

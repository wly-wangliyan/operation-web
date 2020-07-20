import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { PushMessageManagementComponent } from './push-message-management.component';

const routes: Routes = [
    {
        path: '', component: PushMessageManagementComponent,
        canActivate: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'push-management', pathMatch: 'full'},
            {
                path: 'push-management', /** 应用内推送 */
                loadChildren: () => import('../push-message-management/push-management/push-management.module').then(m => m.PushManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'template-push-management', /** 模板消息推送 */
                loadChildren: () => import('../push-message-management/template-push-management/template-push-management.module').then(m => m.TemplatePushManagementModule),
                canLoad: [AuthGuardService]
            }, {
                path: 'template-management', /** 模板管理 */
                loadChildren: () => import('../push-message-management/template-management/template-management.module').then(m => m.TemplateManagementModule),
                canLoad: [AuthGuardService]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PushMessageManagementRoutingModule {
}

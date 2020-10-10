import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { IntegralManagementComponent } from './integral-management.component';

const routes: Routes = [
    {
        path: '', component: IntegralManagementComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'integral-mall', pathMatch: 'full'},
            {
                path: 'integral-mall', /** 积分商城 */
                loadChildren: () => import('./integral-mall/integral-mall.module').then(m => m.IntegralMallModule),
                canLoad: [AuthGuardService]
            },
            {
                path: 'integral-order', /** 积分订单 */
                loadChildren: () => import('./integral-order/integral-order.module').then(m => m.IntegralOrderModule),
                canLoad: [AuthGuardService]
            },
            {
                path: 'integral-record', /** 积分兑换记录 */
                loadChildren: () => import('./integral-record/integral-record.module').then(m => m.IntegralRecordModule),
                canLoad: [AuthGuardService]
            },
            {
                path: 'user-integral', /** 用户积分管理 */
                loadChildren: () => import('./user-integral/user-integral.module').then(m => m.UserIntegralModule),
                canLoad: [AuthGuardService]
            },
            {path: '**', redirectTo: 'integral-mall', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IntegralManagementRoutingModule {
}

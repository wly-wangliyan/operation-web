import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AuthGuardService } from '../../core/auth-guard.service';
import { MallComponent } from './mall.component';

const routes: Routes = [{
    path: '', component: MallComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'goods-management', pathMatch: 'full'},
        {
            path: 'goods-management',
            loadChildren: () => import('./goods-management/goods-management.module').then(m => m.GoodsManagementModule),
            canLoad: [AuthGuardService]
        },
        {
            path: 'goods-order',
            loadChildren: () => import('./goods-order-management/goods-order-management.module').then(m => m.GoodsOrderManagementModule),
            canLoad: [AuthGuardService]
        },
        {path: '**', redirectTo: 'goods-management', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MallRoutingModule {
}

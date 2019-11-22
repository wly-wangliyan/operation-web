import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { GoodsOrderManagementComponent } from './goods-order-management.component';
import { GoodsOrderListComponent } from './goods-order-list/goods-order-list.component';
import { GoodsOrderDetailComponent } from './goods-order-detail/goods-order-detail.component';

const routes: Routes = [
    {
        path: '', component: GoodsOrderManagementComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: GoodsOrderListComponent},
            {path: 'detail/:order_id', component: GoodsOrderDetailComponent},
            {path: '**', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GoodsOrderManagementRoutingModule {
}

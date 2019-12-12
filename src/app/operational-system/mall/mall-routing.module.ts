import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AuthGuardService } from '../../core/auth-guard.service';
import { MallComponent } from './mall.component';
import { HomeComponent } from '../main/home/home.component';
import { MenuGuardService } from '../../core/menu-guard.service';

const routes: Routes = [{
    path: '', component: MallComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
    children: [
        /*{path: '', redirectTo: 'goods-management', pathMatch: 'full'},*/
        {path: 'home', component: HomeComponent},
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
        {
            path: 'goods-business',
            loadChildren: () => import('./business-management/business-management.module').then(m => m.BusinessManagementModule),
            canLoad: [AuthGuardService]
        },
        {path: '**', redirectTo: 'home', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MallRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { OtherOperationConfigComponent } from './other-operation-config.component';


const routes: Routes = [{
    path: '', component: OtherOperationConfigComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'coupon-jump', pathMatch: 'full'},
        {
            path: 'coupon-jump',
            loadChildren: () => import('./coupon-jump/coupon-jump.module').then(m => m.CouponJumpModule),
            canLoad: [AuthGuardService]
        },
        {path: '**', redirectTo: 'coupon-jump', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherOperationConfigRoutingModule {
}

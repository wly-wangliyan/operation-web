import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { CouponJumpComponent } from './coupon-jump.component';
import { CouponJumpListComponent } from './coupon-jump-list/coupon-jump-list.component';


const routes: Routes = [{
    path: '', component: CouponJumpComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'coupon-jump-list', pathMatch: 'full'},
        {path: 'coupon-jump-list', component: CouponJumpListComponent},
        {path: '**', redirectTo: 'coupon-jump-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CouponJumpRoutingModule {
}

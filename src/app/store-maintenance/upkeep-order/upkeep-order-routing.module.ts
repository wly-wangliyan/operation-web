import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { UpkeepOrderComponent } from './upkeep-order.component';
import { OrderListComponent } from './order-list/order-list.component';


const routes: Routes = [{
  path: '', component: UpkeepOrderComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: OrderListComponent },
    // { path: 'order-detail/:order_id', component: OrderDetailComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpkeepOrderRoutingModule { }

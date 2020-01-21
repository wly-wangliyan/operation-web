import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { UpkeepOrderComponent } from './upkeep-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { BatteryDetailComponent } from './battery-detail/battery-detail.component';
import { ArrivalOrderDetailComponent } from './arrival-order-detail/arrival-order-detail.component';
const routes: Routes = [{
  path: '', component: UpkeepOrderComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: OrderListComponent },
    { path: 'bettery-detail/:order_id', component: BatteryDetailComponent },
    { path: 'arrival-order-detail/:order_id', component: ArrivalOrderDetailComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpkeepOrderRoutingModule { }

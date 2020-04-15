import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { WashOrderComponent } from './wash-car-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { StatisticDataComponent } from './statistic-data/statistic-data.component';

const routes: Routes = [{
  path: '', component: WashOrderComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: OrderListComponent },
    { path: 'detail/:wash_car_order_id', component: OrderDetailComponent },
    { path: 'statistic', component: StatisticDataComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WashOrderRoutingModule { }

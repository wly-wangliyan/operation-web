import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { OrderManagementComponent } from './order-management.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

const routes: Routes = [{
  path: '', component: OrderManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'order-list', pathMatch: 'full' },
    { path: 'order-list', component: OrderListComponent },
    { path: 'order-detail/:upkeep_order_id', component: OrderDetailComponent },
    {
      path: 'wash-order',
      loadChildren: () => import('./wash-order/wash-order.module').then(m => m.WashOrderModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrderManagementRoutingModule { }

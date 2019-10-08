import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { AuthGuardService } from '../../core/auth-guard.service';
import { TicketComponent } from './ticket.component';

const routes: Routes = [{
  path: '', component: TicketComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'product-management', pathMatch: 'full' },
    {
      path: 'product-management', /** 产品管理 */
      loadChildren: () => import('./product-management/product-management.module').then(m => m.ProductManagementModule),
      canLoad: [AuthGuardService]
    },
    {
      path: 'order-management', /** 订单管理 */
      loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
      canLoad: [AuthGuardService]
    },
    { path: '**', redirectTo: 'product-management', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }

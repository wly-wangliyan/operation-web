import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { OrderParkingComponent } from './order-parking.component';

const routes: Routes = [{
  path: '', component: OrderParkingComponent,
  children: [
    { path: '', redirectTo: 'order-parking', pathMatch: 'full' },
    {
      path: 'order-parking',
      loadChildren: () => import('./order-parking-main/order-parking-main.module').then(m => m.OrderParkingMainModule),
      canActivate: [AuthGuardService, RouteMonitorService]
    },
    { path: '**', redirectTo: 'order-parking', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OrderParkingRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MenuGuardService } from '../../core/menu-guard.service';
import { HomeComponent } from '../../operational-system/main/home/home.component';
import { OrderParkingMainComponent } from './order-parking-main.component';

const routes: Routes = [{
  path: '', component: OrderParkingMainComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
  children: [
    { path: 'home', component: HomeComponent },
    {
      path: 'service-config',
      loadChildren: () => import('../service-config/service-config.module').then(m => m.ServiceConfigModule),
    },
    {
      path: 'order-management',
      loadChildren: () => import('../order-management/order-management.module').then(m => m.OrderManagementModule),
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderParkingMainRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceConfigComponent } from './service-config/service-config.component';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { HomeComponent } from '../operational-system/main/home/home.component';
import { MenuGuardService } from '../core/menu-guard.service';

const routes: Routes = [
  {
    path: 'service-config', component: ServiceConfigComponent,
    canLoad: [AuthGuardService, MenuGuardService]
  },
  {
    path: 'order-management',
    loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule),
    canLoad: [AuthGuardService, MenuGuardService]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ExemptionRoutingModule { }

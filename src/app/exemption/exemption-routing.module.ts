import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { MenuGuardService } from '../core/menu-guard.service';

const routes: Routes = [
  {
    path: 'service-config',
    loadChildren: () => import('./service-config/service-config.module').then(m => m.ServiceConfigModule),
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

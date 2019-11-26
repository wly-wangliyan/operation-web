import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { ExemptionComponent } from './exemption.component';

const routes: Routes = [{
  path: '', component: ExemptionComponent,
  children: [
    { path: '', redirectTo: 'exemption', pathMatch: 'full' },
    {
      path: 'exemption',
      loadChildren: () => import('./exemption-main/exemption-main.module').then(m => m.ExemptionMainModule),
      canActivate: [AuthGuardService, RouteMonitorService]
    },
    { path: '**', redirectTo: 'exemption', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ExemptionRoutingModule { }

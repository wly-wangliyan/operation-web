
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceConfigListComponent } from './service-config-list/service-config-list.component';
import { ServiceConfigDetailComponent } from './service-config-detail/service-config-detail.component';

const routes: Routes = [{
  path: '', component: ServiceConfigComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'service-config-list', pathMatch: 'full' },
    { path: 'service-config-list', component: ServiceConfigListComponent },
    { path: 'service-config-detail/:order_id', component: ServiceConfigDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceConfigRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ServiceConfigComponent } from './service-config.component';
import { ServiceConfigEditComponent } from './service-config-edit/service-config-edit.component';

const routes: Routes = [{
  path: '', component: ServiceConfigComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'edit', pathMatch: 'full' },
    { path: 'edit', component: ServiceConfigEditComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceConfigRoutingModule { }

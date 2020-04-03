import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { BoothManagementComponent } from './booth-management.component';
import { BoothListComponent } from './booth-list/booth-list.component';
import { BoothConfigListComponent } from './booth-config-list/booth-config-list.component';
import { BoothContentListComponent } from './booth-content-list/booth-content-list.component';

const routes: Routes = [{
  path: '', component: BoothManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'booth-list', pathMatch: 'full' },
    { path: 'booth-list', component: BoothListComponent },
    { path: 'booth-config-list', component: BoothConfigListComponent },
    { path: 'booth-content-list/:booth_id', component: BoothContentListComponent },
    { path: '**', redirectTo: 'booth-list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoothManagementRoutingModule { }

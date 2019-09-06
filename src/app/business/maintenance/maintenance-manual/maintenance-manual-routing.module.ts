import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MaintenanceManualComponent } from './maintenance-manual.component';
import { ManualListComponent } from './manual-list/manual-list.component';


const routes: Routes = [{
  path: '', component: MaintenanceManualComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ManualListComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceManualRoutingModule { }

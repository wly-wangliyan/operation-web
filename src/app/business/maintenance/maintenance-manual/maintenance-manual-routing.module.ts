import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MaintenanceManualComponent } from './maintenance-manual.component';
import { ManualListComponent } from './manual-list/manual-list.component';
import { ManualEditComponent } from './manual-edit/manual-edit.component';


const routes: Routes = [{
  path: '', component: MaintenanceManualComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: ManualListComponent },
    { path: 'edit/:vehicle_type_id', component: ManualEditComponent },
    { path: 'detail/:vehicle_type_id', component: ManualEditComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceManualRoutingModule { }

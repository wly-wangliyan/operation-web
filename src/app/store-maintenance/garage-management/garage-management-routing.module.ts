import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { GarageManagementComponent } from './garage-management.component';
import { GarageListComponent } from './garage-list/garage-list.component';
import { GarageEditComponent } from './garage-edit/garage-edit.component';
import { SupplyConfigListComponent } from './supply-config-list/supply-config-list.component';
import { TechnicianListComponent } from './technician-list/technician-list.component';

const routes: Routes = [
  {
    path: '', component: GarageManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: GarageListComponent },
      { path: 'edit/:repair_shop_id', component: GarageEditComponent },
      { path: 'supply-config-list/:repair_shop_id', component: SupplyConfigListComponent },
      { path: 'technician-list/:repair_shop_id/:repair_shop_name', component: TechnicianListComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarageManagementRoutingModule { }

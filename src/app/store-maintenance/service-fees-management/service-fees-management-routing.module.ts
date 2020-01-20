import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ServiceFeesManagementComponent } from './service-fees-management.component';
import { ServiceFeesListComponent } from './service-fees-list/service-fees-list.component';
import { RescueFeesEditComponent } from './rescue-fees-edit/rescue-fees-edit.component';
import { WorkFeesEditComponent } from './work-fees-edit/work-fees-edit.component';
import { WashCarServiceEditComponent } from './wash-car-service-edit/wash-car-service-edit.component';

const routes: Routes = [
  {
    path: '', component: ServiceFeesManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ServiceFeesListComponent },
      { path: 'edit/:service_fee_id', component: RescueFeesEditComponent },
      { path: 'work-fees-edit/:service_fee_id', component: WorkFeesEditComponent },
      { path: 'wash-car-service-edit', component: WashCarServiceEditComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceFeesManagementRoutingModule {
}

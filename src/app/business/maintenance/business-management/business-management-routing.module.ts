import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { BusinessManagementComponent } from './business-management.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { OperationConfigurationComponent } from './operation-configuration/operation-configuration.component';
import { OperationConfigurationDetailComponent } from './operation-configuration/operation-configuration-detail/operation-configuration-detail.component';
import { OperationConfigurationEditComponent } from './operation-configuration/operation-configuration-edit/operation-configuration-edit.component';

const routes: Routes = [
  {
    path: '', component: BusinessManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: BusinessListComponent },
      { path: 'edit', component: BusinessEditComponent },
      { path: 'operation-configuration', component: OperationConfigurationComponent },
      { path: 'operation-configuration/detail', component: OperationConfigurationDetailComponent },
      { path: 'operation-configuration/edit', component: OperationConfigurationEditComponent },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessManagementRoutingModule { }

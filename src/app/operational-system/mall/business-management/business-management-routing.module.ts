import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessManagementComponent } from './business-management.component';

const routes: Routes = [{
  path: '', component: BusinessManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: BusinessListComponent},
    {path: 'edit/:business_id', component: BusinessEditComponent},
    {path: '**', redirectTo: 'list', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessManagementRoutingModule { }

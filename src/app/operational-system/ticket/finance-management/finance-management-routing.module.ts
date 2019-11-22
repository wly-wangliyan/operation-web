import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { FinanceManagementComponent } from './finance-management.component';
import { PaySettingComponent } from './pay-setting/pay-setting.component';

const routes: Routes = [{
  path: '', component: FinanceManagementComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    { path: '', redirectTo: 'setting', pathMatch: 'full' },
    { path: 'setting', component: PaySettingComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceManagementRoutingModule { }

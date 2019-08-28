import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from '../../core/auth-guard.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import { InsuranceComponent } from './insurance.component';
import { BrokerageCompanyListComponent } from './brokerage-company-management/brokerage-company-list/brokerage-company-list.component';
import { InsuranceCompanyListComponent } from './insurance-company-management/insurance-company-list/insurance-company-list.component';

const routes: Routes = [{
  path: '', component: InsuranceComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService],
  children: [
    {path: '', redirectTo: 'brokerage-company-list', pathMatch: 'full'},
    {path: 'brokerage-company-list', component: BrokerageCompanyListComponent},
    {path: 'insurance-company-list', component: InsuranceCompanyListComponent},
    {path: '**', redirectTo: 'brokerage-company-list', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule {
}

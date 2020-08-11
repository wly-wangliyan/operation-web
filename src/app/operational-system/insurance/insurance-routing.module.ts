import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from '../../core/auth-guard.service';
import {RouteMonitorService} from '../../core/route-monitor.service';
import { InsuranceComponent } from './insurance.component';
import { BrokerageCompanyListComponent } from './brokerage-company-management/brokerage-company-list/brokerage-company-list.component';
import { InsuranceCompanyListComponent } from './insurance-company-management/insurance-company-list/insurance-company-list.component';
import { HomeComponent } from '../../operational-system/main/home/home.component';
import { MenuGuardService } from '../../core/menu-guard.service';

const routes: Routes = [{
  path: '', component: InsuranceComponent,
  canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
  children: [
   /* {path: '', redirectTo: 'brokerage-merchant-list', pathMatch: 'full'},*/
    {path: 'home', component: HomeComponent},
    {path: 'brokerage-merchant-list', component: BrokerageCompanyListComponent},
    {path: 'insurance-merchant-list', component: InsuranceCompanyListComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule {
}

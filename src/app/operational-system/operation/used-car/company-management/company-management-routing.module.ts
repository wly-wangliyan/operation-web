import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyListComponent } from './company-list/company-list.component';


const routes: Routes = [{
    path: '', component: CompanyManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'company-list', pathMatch: 'full'},
        {path: 'company-list', component: CompanyListComponent},
        {path: '**', redirectTo: 'company-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyManagementRoutingModule {
}

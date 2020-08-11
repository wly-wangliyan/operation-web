import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../core/route-monitor.service';
import { MerchantListComponent } from './merchant-list/merchant-list.component';
import { MerchantEditComponent } from './merchant-edit/merchant-edit.component';
import { MerchantManagementComponent } from './merchant-management.component';


const routes: Routes = [{
    path: '', component: MerchantManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'merchant-list', pathMatch: 'full'},
        {path: 'merchant-list', component: MerchantListComponent},
        {path: 'merchant-edit/:merchant_id', component: MerchantEditComponent},
        {path: '**', redirectTo: 'merchant-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantManagementRoutingModule {
}

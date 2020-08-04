import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { InformationDeliveryListComponent } from './information-delivery-list/information-delivery-list.component';
import { InformationDeliveryEditComponent } from './information-delivery-edit/information-delivery-edit.component';
import { InformationDeliveryDetailComponent } from './information-delivery-detail/information-delivery-detail.component';
import { InformationDeliveryManagementComponent } from './information-delivery-management.component';


const routes: Routes = [{
    path: '', component: InformationDeliveryManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'information-delivery-list', pathMatch: 'full'},
        {path: 'information-delivery-list', component: InformationDeliveryListComponent},
        {path: 'information-delivery-create', component: InformationDeliveryEditComponent},
        {path: 'information-delivery-edit/:id', component: InformationDeliveryEditComponent},
        {path: 'information-delivery-detail/:id', component: InformationDeliveryDetailComponent},
        {path: '**', redirectTo: 'information-delivery-list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformationDeliveryManagementRoutingModule {
}

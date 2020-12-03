import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../../../core/auth-guard.service';
import { RouteMonitorService } from '../../../../core/route-monitor.service';
import { InformationDeliveryManagementComponent } from './information-delivery-management.component';
import { InformationDeliveryListComponent } from './information-delivery-list/information-delivery-list.component';
import { InformationDeliveryEditComponent } from './information-delivery-edit/information-delivery-edit.component';
import { InformationDeliveryDetailComponent } from './information-delivery-detail/information-delivery-detail.component';


const routes: Routes = [{
    path: '', component: InformationDeliveryManagementComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService],
    children: [
        {path: '', redirectTo: 'list', pathMatch: 'full'},
        {path: 'list', component: InformationDeliveryListComponent},
        {path: 'create', component: InformationDeliveryEditComponent},
        {path: 'edit/:parking_place_info_id', component: InformationDeliveryEditComponent},
        {path: 'detail/:parking_place_info_id', component: InformationDeliveryDetailComponent},
        {path: '**', redirectTo: 'list', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InformationDeliveryManagementRoutingModule {
}

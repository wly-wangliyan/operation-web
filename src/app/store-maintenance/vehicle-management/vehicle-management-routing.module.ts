import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { VehicleManagementComponent } from './vehicle-management.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleEditComponent } from './vehicle-edit/vehicle-edit.component';

const routes: Routes = [
    {
        path: '', component: VehicleManagementComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: VehicleListComponent},
            {path: 'edit', component: VehicleEditComponent},
            {path: '**', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VehicleManagementRoutingModule {
}

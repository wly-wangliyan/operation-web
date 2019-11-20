import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { StoreMaintenanceComponent } from './store-maintenance.component';

const routes: Routes = [{
    path: '', component: StoreMaintenanceComponent,
    children: [
        {path: '', redirectTo: 'store-maintenance', pathMatch: 'full'},
        {
            path: 'store-maintenance',
            loadChildren: './store-maintenance-main/store-maintenance-main.module#StoreMaintenanceMainModule',
            canActivate: [AuthGuardService, RouteMonitorService]
        },
        {path: '**', redirectTo: 'store-maintenance', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class StoreMaintenanceRoutingModule {
}

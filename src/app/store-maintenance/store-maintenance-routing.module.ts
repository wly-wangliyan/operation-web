import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/auth-guard.service';
import { RouteMonitorService } from '../core/route-monitor.service';
import { StoreMaintenanceComponent } from './store-maintenance.component';

const routes: Routes = [{
    path: '', component: StoreMaintenanceComponent,
    children: [
        {path: '', redirectTo: 'brand-management', pathMatch: 'full'},
        {
            path: 'brand-management',
            loadChildren: './brand-management/brand-management.module#MainModule',
            canActivate: [AuthGuardService, RouteMonitorService]
        },
        {path: '**', redirectTo: 'main', pathMatch: 'full'}
    ]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class StoreMaintenanceRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { MenuGuardService } from '../../core/menu-guard.service';
import { StoreMaintenanceMainComponent } from './store-maintenance-main.component';

const routes: Routes = [{
    path: '', component: StoreMaintenanceMainComponent,
    canActivateChild: [AuthGuardService, RouteMonitorService, MenuGuardService],
    children: [
        {path: '', redirectTo: 'brand-management', pathMatch: 'full'},
        {
            path: 'brand-management',
            loadChildren: () => import('../brand-management/brand-management.module').then(m => m.BrandManagementModule),
        },
        {path: '**', redirectTo: 'brand-management', pathMatch: 'full'},
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StoreMaintenanceMainRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { BrandManagementComponent } from './brand-management.component';
import { BrandListComponent } from './brand-list/brand-list.component';

const routes: Routes = [
    {
        path: '', component: BrandManagementComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: BrandListComponent},
            {path: '**', redirectTo: 'list', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandManagementRoutingModule {
}

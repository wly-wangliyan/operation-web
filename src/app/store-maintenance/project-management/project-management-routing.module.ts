import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../core/auth-guard.service';
import { RouteMonitorService } from '../../core/route-monitor.service';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

const routes: Routes = [
    {
        path: '', component: ProjectManagementComponent,
        canActivateChild: [AuthGuardService, RouteMonitorService],
        children: [
            {path: '', redirectTo: 'list', pathMatch: 'full'},
            {path: 'list', component: ProjectListComponent},
            {path: 'edit', component: ProjectEditComponent},
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
